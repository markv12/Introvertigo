using System;
using UnityEngine;

public abstract class SceneAnimator : MonoBehaviour {
    public AudioClip enemyTalkClip;
    [Range(0f, 2f)]
    public float enemyPitchVariation = 1;
    public Sprite goodEndSprite;
    public Sprite badEndSprite;
    public Sprite rudeEndSprite;

    public abstract EndType HandleResponse(GPTResponse gptResponse);

    public Sprite EndSprite(EndType endType) {
        switch (endType) {
            case EndType.good:
                return goodEndSprite;
            case EndType.bad:
                return badEndSprite;
            case EndType.rude:
                return rudeEndSprite;
            default:
                return null;
        }
    }
}
