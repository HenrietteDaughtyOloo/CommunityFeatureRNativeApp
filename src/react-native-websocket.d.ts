declare module 'react-native-websocket' {
    import * as React from 'react';
  
    interface WebSocketProps {
      url: string;
      onOpen?: () => void;
      onClose?: (event: WebSocketCloseEvent) => void;
      onMessage?: (message: WebSocketMessageEvent) => void;
      onError?: (error: WebSocketErrorEvent) => void;
      reconnect?: boolean;
      reconnectIntervalInMilliSeconds?: number;
      reconnectAttempts?: number;
    }
  
    class WebSocket extends React.Component<WebSocketProps> {}
  
    export default WebSocket;
  }  