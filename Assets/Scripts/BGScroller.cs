using UnityEngine;

public class BGScroller : MonoBehaviour {
    public MeshRenderer mainRenderer;
    [Range(0, 3)]
    public float scrollSpeed;

    private Material material;
    private void Awake() {
        material = mainRenderer.material;
    }

    private void LateUpdate() {
        material.SetTextureOffset("_MainTex", new Vector2(Time.time * scrollSpeed, 0));
    }
}
