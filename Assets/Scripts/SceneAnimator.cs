using UnityEngine;

public abstract class SceneAnimator : MonoBehaviour {
    public AudioClip enemyTalkClip;
    [Range(0f, 2f)]
    public float enemyPitchVariation = 1;
    public abstract void HandleResponse(GPTResponse gptResponse);
}
