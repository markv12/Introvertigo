using UnityEngine;
using NativeWebSocket;
using System.Threading.Tasks;
using System;

public class WebsocketTest : MonoBehaviour
{
  private void Start()
  {
    WebsocketManager.Instance.ConnectAsUser("unityTest", (message) =>
              {
                Debug.Log("JSON message of type " + message.type + " received from server:");
                Debug.Log("  " + message.content);
              },
              () =>
              {
                Debug.Log("Connected to server!");
              },
              (error) =>
              {
                Debug.Log("Error! " + error);
              },
              () =>
              {
                Debug.Log("Disconnected from server!");
              }
         );

    InvokeRepeating("SendMessageToServer", 0.0f, 1.0f);
  }

  private void SendMessageToServer()
  {
    WebsocketManager.Instance.SendWebSocketMessage("Hello from Unity!");
  }
}