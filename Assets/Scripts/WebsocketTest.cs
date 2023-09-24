using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using NativeWebSocket;

public class WebsocketTest : MonoBehaviour
{
    WebSocket websocket;

    // Start is called before the first frame update
    async void Start()
    {
        websocket = new WebSocket("wss://p.jasperstephenson.com/ld54/ws?userId=unityTest");

        websocket.OnOpen += () =>
        {
            Debug.Log("Connection open");
        };

        websocket.OnError += (e) =>
        {
            Debug.Log("Error " + e);
        };

        websocket.OnClose += (e) =>
        {
            Debug.Log("Connection closed");
        };

        websocket.OnMessage += (bytes) =>
        {
            // read byte array as string
            var message = System.Text.Encoding.UTF8.GetString(bytes);
            Debug.Log("OnMessage " + message);
        };

        // Keep sending messages
        InvokeRepeating("SendWebSocketMessage", 0.0f, 1f);

        // connect and wait for messages
        await websocket.Connect();
    }

    void Update()
    {
#if UNITY_WEBGL || UNITY_EDITOR
        websocket.DispatchMessageQueue();
#endif
    }

    async void SendWebSocketMessage()
    {
        if (websocket.State == WebSocketState.Open)
        {
            // Sending plain text
            await websocket.SendText("plain text message");
        }
    }

    private async void OnApplicationQuit()
    {
        await websocket.Close();
    }

}