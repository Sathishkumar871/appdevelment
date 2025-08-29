declare module 'react-native-jitsi-meet' {
  export function call(url: string, userInfo?: { displayName: string }): void;
  export function endCall(): void;
  export const JitsiMeetEvents: {
    addListener: (
      eventName: string,
      callback: (event: any) => void
    ) => { remove: () => void };
  };
}
