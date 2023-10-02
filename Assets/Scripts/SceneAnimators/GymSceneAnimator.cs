using System;
using UnityEngine;

public class GymSceneAnimator : SceneAnimator {
    public GymSceneStep[] steps;
    public Transform enemyT;
    public SpriteRenderer enemyRenderer;
    public SpriteRenderer armsRenderer;
    public WorldSpriteSineColorAnimator enemySineAnim;
    public Vignette vignette;

    public int startIndex;
    private int currentIndex;
    private void Start() {
        MoveToIndex(startIndex);
    }

    private int rudeCount = 0;
    public override EndType HandleResponse(GPTResponse gptResponse) {
        if (gptResponse.rudeness > 0) {
            rudeCount++;
        }
        if (rudeCount == 0) {
            enemySineAnim.enabled = false;
            enemyRenderer.color = Color.white;
        } else if (rudeCount == 1) {
            enemySineAnim.enabled = true;
        } else if (rudeCount >= 2) {
            return EndType.rude;
        }

        if (gptResponse.rating < -RATING_DEAD_ZONE) {
            if (currentIndex < steps.Length - 1) {
                MoveToIndex(currentIndex + 1);
            } else {
                return EndType.good;
            }
        } else if (gptResponse.rating > RATING_DEAD_ZONE) {
            if (currentIndex > 0) {
                MoveToIndex(currentIndex - 1);
            } else {
                return EndType.bad;
            }
        }

        return EndType.none;
    }

    private Coroutine enemyRoutine;
    private void MoveToIndex(int index) {
        currentIndex = index;
        GymSceneStep step = steps[index];
        Vector3 enemyStartPos = enemyT.position;
        Vector3 enemyEndPos = step.enemyPos.position;
        armsRenderer.sprite = step.armSprite;

        vignette.SetVignette(step.vignetteAmount);

        bool swappedSprites = false;
        this.EnsureCoroutineStopped(ref enemyRoutine);
        enemyRoutine = this.CreateAnimationRoutine(1.2f, (float progress) => {
            enemyT.position = Vector3.Lerp(enemyStartPos, enemyEndPos, Easing.easeInOutSine(0, 1, progress));
            if(!swappedSprites && progress > 0.5f) {
                swappedSprites = true;
                enemyRenderer.sprite = step.enemySprite;
                enemyRenderer.sortingOrder = step.enemySortingOrder;
            }
        });
    }
}

[Serializable]
public class GymSceneStep {
    public Transform enemyPos;
    public Sprite enemySprite;
    public int enemySortingOrder;
    public Sprite armSprite;
    public float vignetteAmount;
}
