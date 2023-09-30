using UnityEngine;
using NativeWebSocket;
using System.Threading.Tasks;
using System;

public class WebsocketManager : Singleton<WebsocketManager>
{

    public bool isConnected { get { return connectedUserId != null; } }
    public string getConnectedUserId { get { return connectedUserId; } }


    WebSocket websocket;
    private bool autoReconnect = true;
    private string connectedUserId = null;
    private bool attemtingReconnect = false;

    void Update()
    {
#if UNITY_WEBGL || UNITY_EDITOR
        websocket?.DispatchMessageQueue();
#endif
    }

    public async void ConnectAsUser(string userId, Action<WebsocketMessage> onMessage, Action onConnect = null, Action<string> onError = null, Action onClose = null)
    {
        if (websocket != null) await disconnect();

        websocket = new WebSocket("wss://p.jasperstephenson.com/ld54/ws?userId=" + userId);

        websocket.OnOpen += () =>
        {
            if (onConnect == null) Debug.Log("Websocket connected as " + userId);
            connectedUserId = userId;
            onConnect?.Invoke();
        };

        websocket.OnError += async (e) =>
        {
            if (onError == null) Debug.Log("Websocket error! " + e);
            onError?.Invoke(e);
            connectedUserId = null;
            await reconnect();
        };

        websocket.OnClose += async (e) =>
        {
            if (onClose == null) Debug.Log("Websocket connection closed — either server went down or the client's internet did. Will attempt to reconnect.");
            onClose?.Invoke();
            connectedUserId = null;
            await reconnect();
        };

        websocket.OnMessage += (bytes) =>
        {
            // read byte array as string
            var message = System.Text.Encoding.UTF8.GetString(bytes);
            if (onMessage == null) Debug.Log("Websocket Raw Message " + message);
            onMessage?.Invoke(ParseServerResponse(message));
        };

        // connect and wait for messages
        autoReconnect = true;
        await websocket.Connect();

    }

    public async void SendWebSocketMessage(string message = "Hi there!")
    {
        if (Instance.websocket?.State == WebSocketState.Open)
        {
            // Debug.Log("Sending message: " + message);
            // Sending plain text, could be stringified json data
            await Instance.websocket.SendText(message);
        }
        else
        {
            Debug.Log("Websocket not connected, message not sent.");
        }
    }

    private async void OnApplicationQuit()
    {
        await disconnect();
    }

    private async Task<bool> disconnect()
    {
        if (websocket.State == WebSocketState.Closed) return true;
        autoReconnect = false;
        connectedUserId = null;
        await websocket.Close();
        return websocket.State == WebSocketState.Closed;
    }

    private async Task<bool> reconnect()
    {
        if (websocket.State == WebSocketState.Open) return true;
        if (!autoReconnect) return false;
        // wait 1 second
        await Task.Delay(1000);

        if (attemtingReconnect) return websocket.State == WebSocketState.Open;
        attemtingReconnect = true;
        Debug.Log("Attempting to reconnect...");
        await websocket.Connect();
        attemtingReconnect = false;
        return websocket.State == WebSocketState.Open;
    }


    private WebsocketMessage ParseServerResponse(string message)
    {
        try
        {
            var json = JsonUtility.FromJson<WebsocketMessage>(message);
            return json;
        }
        catch (Exception e)
        {
            Debug.LogError("Error parsing websocket message: " + e);
            return null;
        }

    }
}

