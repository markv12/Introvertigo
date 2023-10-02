using UnityEngine;

public class WorldSpriteSineColorAnimator : MonoBehaviour {
    public SpriteRenderer[] mainRenderers;
    public Color lowColor;
    public Color highColor;
    public float lowScale = 1;
    public float highScale = 1;
    public float pulsesPerSecond;

    private float timeOffset = 0;

    private void OnEnable() {
        timeOffset = Time.time;
    }

    private void Update() {
        float cosOutput = CosineZeroToOne(Time.unscaledTime - timeOffset, pulsesPerSecond);
        Color resultColor = Color.Lerp(lowColor, highColor, cosOutput);
        float resultScale = Mathf.Lerp(lowScale, highScale, cosOutput);

        for (int i = 0; i < mainRenderers.Length; i++) {
            SpriteRenderer mr = mainRenderers[i];
            mr.color = resultColor;
            mr.transform.localScale = new Vector3(resultScale, resultScale, 1);
        }
    }

    private const float COS_FULL_PERIOD = Mathf.PI * 2;
    public static float CosineZeroToOne(float elapsedTime, float pulsesPerSecond) {
        float cosInput = elapsedTime * COS_FULL_PERIOD * pulsesPerSecond;
        return ((-Mathf.Cos(cosInput)) + 1f) / 2f;
    }
}
