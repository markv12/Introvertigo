
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace KingdomOfNight
{
    public static class TransformExtensions
    {
        private static StringBuilder theBuilder = new StringBuilder(32);
        private static List<Transform> heirarchy = new List<Transform>(8);

        public static string GetPath(this Transform t)
        {
            theBuilder.Length = 0;
            heirarchy.Clear();
            Transform currentTransform = t;
            while (currentTransform.parent != null)
            {
                heirarchy.Add(currentTransform);
                currentTransform = currentTransform.parent;
            }
            heirarchy.Add(currentTransform);

            var scene = SceneManager.GetActiveScene();
            theBuilder.Append(scene.name);
            theBuilder.Append("/");
            for (int i = heirarchy.Count - 1; i >= 0; i--)
            {
                theBuilder.Append(heirarchy[i].name);
                if (i != 0)
                    theBuilder.Append("/");
            }
            return theBuilder.ToString();
        }
    }
}
