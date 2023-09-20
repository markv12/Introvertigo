using UnityEngine;

namespace KingdomOfNight
{
    public static class Layers
    {
        private static bool initialized = false;

        private static int playerLayer;
        private static int playerMask;
        private static int environmentGroundLayer;
        private static int environmentGroundMask;
        private static int environmentProjectileMask;
        private static int playerCameraBoundsLayer;
        private static int enemyMask;
        private static int minimapLayer;

        private static void EnsureInitialized()
        {
            if (!initialized)
            {
                playerLayer = LayerMask.NameToLayer("Player");
                playerMask = LayerMask.GetMask("Player");
                environmentGroundLayer = LayerMask.NameToLayer("Environment_Ground");
                environmentGroundMask = LayerMask.GetMask("Environment_Ground");
                environmentProjectileMask = LayerMask.GetMask("Environment_Projectile");
                playerCameraBoundsLayer = LayerMask.NameToLayer("PlayerCameraBounds");
                enemyMask = LayerMask.GetMask("Enemy");
                minimapLayer = LayerMask.NameToLayer("Minimap");
                initialized = true;
            }
        }

        public static int PlayerLayer
        {
            get
            {
                EnsureInitialized();
                return playerLayer;
            }
        }

        public static int PlayerMask
        {
            get
            {
                EnsureInitialized();
                return playerMask;
            }
        }

        public static int EnvironmentGroundLayer
        {
            get
            {
                EnsureInitialized();
                return environmentGroundLayer;
            }
        }

        public static int EnvironmentGroundMask
        {
            get
            {
                EnsureInitialized();
                return environmentGroundMask;
            }
        }

        public static int EnvironmentProjectileMask
        {
            get
            {
                EnsureInitialized();
                return environmentProjectileMask;
            }
        }

        public static int PlayerCameraBoundsLayer
        {
            get
            {
                EnsureInitialized();
                return playerCameraBoundsLayer;
            }
        }

        public static int EnemyMask
        {
            get
            {
                EnsureInitialized();
                return enemyMask;
            }
        }

        public static int MinimapLayer
        {
            get
            {
                EnsureInitialized();
                return minimapLayer;
            }
        }
    }
}
