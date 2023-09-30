using UnityEngine;

public class UrinalSceneAnimator : SceneAnimator {
    public Transform enemyT;
    public Transform[] enemyPositions;

    public Transform cameraT;
    public Transform[] cameraPositions;
    public int startIndex;
    private int currentIndex;
    private void Start() {
        MoveToIndex(startIndex);
    }

    public override void HandleResponse(GPTResponse gptResponse) {
        if(gptResponse.rating < 5) {
            MoveToIndex(currentIndex - 1);
        } else {
            MoveToIndex(currentIndex + 1);
        }
    }

    private Coroutine enemyRoutine;
    private Coroutine cameraRoutine;
    private void MoveToIndex(int index) {
        currentIndex = index;
        Vector3 enemyStartPos = enemyT.position;
        Vector3 enemyEndPos = enemyPositions[index].position;

        Vector3 cameraStartPos = cameraT.position;
        Vector3 cameraEndPos = cameraPositions[index].position;
        Quaternion cameraStartRotation = cameraT.rotation;
        Quaternion cameraEndRotation = cameraPositions[index].rotation;

        this.EnsureCoroutineStopped(ref enemyRoutine);
        enemyRoutine = this.CreateAnimationRoutine(1f, (float progress) => {
            enemyT.position = Vector3.Lerp(enemyStartPos, enemyEndPos, Easing.easeInOutSine(0, 1, progress));
        });

        this.EnsureCoroutineStopped(ref cameraRoutine);
        cameraRoutine = this.CreateAnimationRoutine(1.2f, (float progress) => {
            float easedProgress = Easing.easeInOutSine(0, 1, progress);
            cameraT.SetPositionAndRotation(Vector3.Lerp(cameraStartPos, cameraEndPos, easedProgress), Quaternion.Lerp(cameraStartRotation, cameraEndRotation, easedProgress));
        });
    }
}
