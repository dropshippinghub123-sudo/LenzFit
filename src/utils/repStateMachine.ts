export type RepState = 'idle' | 'descending' | 'bottom' | 'ascending' | 'completed';

export class RepStateMachine {
  private state: RepState = 'idle';
  private lastDepth: number = 0;

  update(depth: number) {
    switch (this.state) {
      case 'idle':
        if (depth > 0.1) this.state = 'descending';
        break;
      case 'descending':
        if (depth < 0.05) this.state = 'bottom';
        break;
      case 'bottom':
        if (depth > 0.1) this.state = 'ascending';
        break;
      case 'ascending':
        if (depth < 0.05) this.state = 'completed';
        break;
      case 'completed':
        this.state = 'idle';
        break;
    }
    this.lastDepth = depth;
    return this.state;
  }
}
