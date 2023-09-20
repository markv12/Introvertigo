using UnityEngine;

namespace KingdomOfNight
{
    public static class Collider2DExtensions
    {
        public static float LargestExtent(this Collider2D c)
        {
            Vector3 colliderExtents = c.bounds.extents;
            return Mathf.Max(colliderExtents.x, colliderExtents.y);
        }
    }
}
