using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Vignette : MonoBehaviour
{
    public Image vignetteImage;
    public float zoomSpeed = 1.0f;
    private float targetScale = 1.0f;

    private void Update()
    {
        float currentScale = vignetteImage.rectTransform.localScale.x;
        float newScale = Mathf.Lerp(currentScale, targetScale, Time.deltaTime * zoomSpeed);
        vignetteImage.rectTransform.localScale = new Vector3(newScale, newScale, 1.0f);
    }
    public void SetVignette(float value)
    {
        float transformValue = (1.3f - value * 0.6f);
        targetScale = transformValue;
    }
}
