-#import "RCTFormRating.h"
-#import <React/RCTLog.h>
-#import <AVFoundation/AVFoundation.h>
-#import <Vision/Vision.h>

@interface RCTFormRating () <AVCaptureVideoDataOutputSampleBufferDelegate>

@property (nonatomic, strong) AVCaptureSession *captureSession;
@property (nonatomic, strong) dispatch_queue_t captureQueue;
@property (nonatomic, assign) BOOL running;
@property (nonatomic, strong) VNDetectHumanBodyPoseRequest *poseRequest;
@property (nonatomic, strong) VNSequenceRequestHandler *sequenceHandler;
@property (nonatomic, strong) VNCoreMLRequest *mlRequest;
@property (nonatomic, assign) BOOL usingCoreMLModel;

@end

@implementation RCTFormRating

RCT_EXPORT_MODULE(FormRating);

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onLandmarksUpdate", @"onFormFeedback"];
}

RCT_EXPORT_METHOD(startSession:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"FormRating startSession called with options: %@", options);

  if (self.running) {
    resolve(@{@"status": @"already_running"});
    return;
  }

  self.captureQueue = dispatch_queue_create("com.lenzfit.formrating.capture", DISPATCH_QUEUE_SERIAL);
  self.captureSession = [[AVCaptureSession alloc] init];
  self.captureSession.sessionPreset = AVCaptureSessionPreset640x480;

  AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
  if (!device) {
    reject(@"no_camera", @"No camera device available.", nil);
    return;
  }

  NSError *error = nil;
  AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:device error:&error];
  if (error || !input) {
    reject(@"camera_input_error", error.localizedDescription, error);
    return;
  }

  if ([self.captureSession canAddInput:input]) {
    [self.captureSession addInput:input];
  }

  AVCaptureVideoDataOutput *output = [[AVCaptureVideoDataOutput alloc] init];
  [output setAlwaysDiscardsLateVideoFrames:YES];
  [output setVideoSettings:@{(id)kCVPixelBufferPixelFormatTypeKey: @(kCVPixelFormatType_32BGRA)}];
  [output setSampleBufferDelegate:self queue:self.captureQueue];
  if ([self.captureSession canAddOutput:output]) {
    [self.captureSession addOutput:output];
  }

  self.poseRequest = [[VNDetectHumanBodyPoseRequest alloc] init];
  self.sequenceHandler = [[VNSequenceRequestHandler alloc] init];

  // Attempt to load a bundled Core ML model named "MoveNet" (MoveNet.mlmodel or compiled .mlmodelc)
  self.usingCoreMLModel = NO;
  NSString *modelName = @"MoveNet";
  NSBundle *bundle = [NSBundle mainBundle];
  NSURL *modelURL = nil;
  // Check compiled model
  NSString *mlcPath = [bundle pathForResource:modelName ofType:@"mlmodelc"];
  if (mlcPath) {
    modelURL = [NSURL fileURLWithPath:mlcPath];
  } else {
    NSString *mlPath = [bundle pathForResource:modelName ofType:@"mlmodel"];
    if (mlPath) {
      modelURL = [NSURL fileURLWithPath:mlPath];
    }
  }
  if (modelURL) {
    NSError *modelErr = nil;
    MLModel *mlModel = [MLModel modelWithContentsOfURL:modelURL error:&modelErr];
    if (!modelErr && mlModel) {
      NSError *vnErr = nil;
      VNCoreMLModel *vnModel = [VNCoreMLModel modelForMLModel:mlModel error:&vnErr];
      if (!vnErr && vnModel) {
        self.mlRequest = [[VNCoreMLRequest alloc] initWithModel:vnModel completionHandler:^(VNRequest * _Nonnull request, NSError * _Nullable error) {
          // The completion is handled inline in captureOutput when using performRequests:; we keep this minimal.
          if (error) {
            RCTLogWarn(@"CoreML VNCoreMLRequest error: %@", error.localizedDescription);
          }
        }];
        self.usingCoreMLModel = YES;
        RCTLogInfo(@"Loaded Core ML model at %@", modelURL.path);
      }
    }
  }

  [self.captureSession startRunning];
  self.running = YES;

  resolve(@{@"status": @"started"});
}

RCT_EXPORT_METHOD(stopSession:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"FormRating stopSession called");
  if (!self.running) {
    resolve(@{@"status": @"not_running"});
    return;
  }
  [self.captureSession stopRunning];
  self.captureSession = nil;
  self.running = NO;
  resolve(@{@"status": @"stopped"});
}

RCT_EXPORT_METHOD(processFrame:(NSString *)base64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"FormRating processFrame called (base64 length: %lu)", (unsigned long)base64.length);

  // For now, respond with a stubbed result similar to the JS stub so UI can proceed.
  NSDictionary *stubResult = @{
    @"score": @85,
    @"breakdown": @{@"posture": @88, @"range": @79, @"tempo": @90, @"alignment": @83},
    @"landmarks": @[@{@"name": @"nose", @"x": @0.5, @"y": @0.2, @"confidence": @0.95}]
  };

  resolve(stubResult);
}

// AVCaptureVideoDataOutputSampleBufferDelegate
- (void)captureOutput:(AVCaptureOutput *)output didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection
{
  CVImageBufferRef pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
  if (!pixelBuffer) return;

  VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCVPixelBuffer:pixelBuffer options:@{}];
  NSError *error = nil;
  // If a Core ML model is available and loaded, try it first
  if (self.usingCoreMLModel && self.mlRequest) {
    NSError *mlErr = nil;
    [handler performRequests:@[self.mlRequest] error:&mlErr];
    if (!mlErr && self.mlRequest.results.count > 0) {
      NSMutableArray *landmarks = [NSMutableArray array];
      for (VNObservation *obs in self.mlRequest.results) {
        if ([obs isKindOfClass:[VNRecognizedPointsObservation class]]) {
          VNRecognizedPointsObservation *rp = (VNRecognizedPointsObservation *)obs;
          NSError *rpErr = nil;
          NSDictionary<NSString *, VNRecognizedPoint *> *points = [rp recognizedPointsForJointsGroup:VNHumanBodyPoseObservationJointsGroupAll error:&rpErr];
          if (rpErr || !points) continue;
          for (NSString *key in points) {
            VNRecognizedPoint *p = points[key];
            if (p.confidence < 0.01) continue;
            NSDictionary *ld = @{@"name": key, @"x": @(p.location.x), @"y": @(1.0 - p.location.y), @"confidence": @(p.confidence)};
            [landmarks addObject:ld];
          }
        }
      }
      if (landmarks.count > 0) {
        double avgConfidence = 0.0;
        for (NSDictionary *d in landmarks) { avgConfidence += [d[@"confidence"] doubleValue]; }
        avgConfidence /= landmarks.count;
        int score = (int)round(avgConfidence * 100.0);
        [self sendEventWithName:@"onLandmarksUpdate" body:@{ @"landmarks": landmarks }];
        [self sendEventWithName:@"onFormFeedback" body:@{ @"score": @(score), @"breakdown": @{@"posture": @(score), @"range": @(score), @"tempo": @(score), @"alignment": @(score)} }];
        return;
      }
    }
    // If ML model produced nothing usable, fall through to Vision's built-in pose detector
  }

  [handler performRequests:@[self.poseRequest] error:&error];
  if (error) {
    RCTLogWarn(@"Vision request error: %@", error.localizedDescription);
    return;
  }

  NSArray<VNHumanBodyPoseObservation *> *results = self.poseRequest.results;
  if (results.count == 0) return;

  VNHumanBodyPoseObservation *obs = results.firstObject;
  NSError *pointsError = nil;
  NSDictionary<NSString *, VNRecognizedPoint *> *points = [obs recognizedPointsForJointsGroup:VNHumanBodyPoseObservationJointsGroupAll error:&pointsError];
  if (pointsError || !points) return;

  NSMutableArray *landmarks = [NSMutableArray array];
  double avgConfidence = 0.0;
  int count = 0;
  for (NSString *key in points) {
    VNRecognizedPoint *p = points[key];
    if (p.confidence < 0.01) continue;
    NSDictionary *ld = @{@"name": key, @"x": @(p.location.x), @"y": @(1.0 - p.location.y), @"confidence": @(p.confidence)};
    [landmarks addObject:ld];
    avgConfidence += p.confidence;
    count++;
  }

  if (count > 0) avgConfidence /= count;

  // Simple scoring heuristic: normalize average confidence to 0-100
  int score = (int)round(avgConfidence * 100.0);

  [self sendEventWithName:@"onLandmarksUpdate" body:@{ @"landmarks": landmarks }];
  [self sendEventWithName:@"onFormFeedback" body:@{ @"score": @(score), @"breakdown": @{@"posture": @(score), @"range": @(score), @"tempo": @(score), @"alignment": @(score)} }];
}

- (void)startObserving {
  // No-op; events are sent during capture
}

- (void)stopObserving {
  // No-op
}

@end
