using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

public static class RestUtility {
    public static IEnumerator Get(string uri, Action<string> onComplete, Action onError = null, bool autoRetry = true) {

        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri)) {
            yield return webRequest.SendWebRequest();
            switch (webRequest.result) {
                case UnityWebRequest.Result.ConnectionError:
                case UnityWebRequest.Result.DataProcessingError:
                case UnityWebRequest.Result.ProtocolError:
                    Debug.LogError(uri + ": HTTP Error: " + webRequest.error);
                    if (autoRetry) {
                        yield return Get(uri, onComplete, onError, false);
                    } else {
                        onError?.Invoke();
                    }
                    break;
                case UnityWebRequest.Result.Success:
                    onComplete?.Invoke(webRequest.downloadHandler.text);
                    break;
            }
        }
    }

    public static IEnumerator Post(string uri, ValueTuple<string, string>[] bodyParams, Action<bool, string> onComplete, bool autoRetry = true) {

        WWWForm form = new WWWForm();
        for (int i = 0; i < bodyParams.Length; i++) {
            ValueTuple<string, string> param = bodyParams[i];
            form.AddField(param.Item1, param.Item2);
        }
        using (UnityWebRequest webRequest = UnityWebRequest.Post(uri, form)) {
            webRequest.downloadHandler = new DownloadHandlerBuffer();
            yield return webRequest.SendWebRequest();

            switch (webRequest.result) {
                case UnityWebRequest.Result.ConnectionError:
                case UnityWebRequest.Result.DataProcessingError:
                    Debug.LogError(uri + ": Error: " + webRequest.error);
                    if (autoRetry) yield return Post(uri, bodyParams, onComplete, false);
                    break;
                case UnityWebRequest.Result.ProtocolError:
                    Debug.LogError(uri + ": HTTP Error: " + webRequest.error);
                    if (webRequest.responseCode == 400) {
                        onComplete?.Invoke(false, webRequest.downloadHandler.text);
                    } else {
                        if (autoRetry) yield return Post(uri, bodyParams, onComplete, false);
                    }
                    break;
                case UnityWebRequest.Result.Success:
                    onComplete?.Invoke(true, webRequest.downloadHandler.text);
                    break;
            }
        }
    }

    public static IEnumerator PostJSON(string uri, string jsonString, Action<bool, string> onComplete, bool autoRetry = true) {
        using (UnityWebRequest request = new UnityWebRequest(uri, "POST")) {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonString);
            request.uploadHandler = (UploadHandler)new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            yield return request.SendWebRequest();
            Debug.Log("Status Code: " + request.responseCode);

            switch (request.result) {
                case UnityWebRequest.Result.ConnectionError:
                case UnityWebRequest.Result.DataProcessingError:
                    Debug.LogError(uri + ": Error: " + request.error);
                    if (autoRetry) yield return PostJSON(uri, jsonString, onComplete, false);
                    break;
                case UnityWebRequest.Result.ProtocolError:
                    Debug.LogError(uri + ": HTTP Error: " + request.error);
                    if (request.responseCode == 400) {
                        onComplete?.Invoke(false, request.downloadHandler.text);
                    } else {
                        if (autoRetry) yield return PostJSON(uri, jsonString, onComplete, false);
                    }
                    break;
                case UnityWebRequest.Result.Success:
                    onComplete?.Invoke(true, request.downloadHandler.text);
                    break;
            }
        }
    }
}
