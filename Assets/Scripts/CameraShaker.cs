using UnityEngine;

public class CameraShaker : MonoBehaviour {
    public Transform mainT;
    public float speed;
    public float magnitude;

    private void Update() {
        float time = Time.time * speed;
        float x = (Mathf.Sin(time) + Mathf.Sin(time * 2)) * magnitude;
        float y = (Mathf.Sin(time * 0.9f) + Mathf.Sin(time *2.2f)) * magnitude;
        float xRot = (Mathf.Sin(time*0.7f) + Mathf.Sin(time * 2.12f)) * magnitude;
        float yRot = (Mathf.Sin(time * 1.4f) + Mathf.Sin(time * 1.9f)) * magnitude;
        mainT.localPosition = new Vector3(x, y, 0);
        mainT.localEulerAngles = new Vector3(xRot, yRot, 0);
    }
}
