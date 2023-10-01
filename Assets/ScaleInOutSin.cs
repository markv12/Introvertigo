using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScaleInOutSin : MonoBehaviour
{

    public float zoomSpeed = 1.0f;
    public float minScale = .8f;
    public float maxScale = 1.2f;
    private float initialScale;

    private void Start()
    {
        initialScale = transform.localScale.x;
    }

    private void Update()
    {
        transform.localScale = Mathf.Sin(Time.time * zoomSpeed) * (maxScale - minScale) * Vector3.one + Vector3.one * (minScale + maxScale) / 2 * initialScale;
    }
}
