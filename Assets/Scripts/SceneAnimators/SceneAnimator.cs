using System;
using UnityEngine;

public abstract class SceneAnimator : MonoBehaviour {
    public AudioClip enemyTalkClip;
    [Range(0f, 1f)]
    public float enemyTalkVolume = 1;
    [Range(0f, 2f)]
    public float enemyPitchVariation = 1;
    public Sprite enemyPog;
    public Sprite goodEndSprite;
    public Sprite badEndSprite;
    public Sprite rudeEndSprite;

    protected const float RATING_DEAD_ZONE = 0.15f;
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
