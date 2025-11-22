#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface RCTFormRating : RCTEventEmitter <RCTBridgeModule>

// Exposed methods:
// - (void)startSession:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
// - (void)stopSession:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
// - (void)processFrame:(NSString *)base64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

@end
