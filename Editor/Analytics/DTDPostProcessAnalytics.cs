﻿using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;
using UnityEditor.iOS.Xcode.Extensions;
using UnityEngine;

namespace DevToDev.Analytics.Editor
{
    public static class DTDPostProcessAnalytics
    {
        private const string UNITY_ANALYTICS_NAME = "DTDAnalyticsiOSUnity.xcframework";
        private const string PACKAGE_NAME = "com.devtodev.sdk.analytics";
        private const bool IS_COPPA_ENABLED = false;

        [PostProcessBuild(98)]
        public static void OnPostProcessBuild(BuildTarget target, string pathToBuiltProject)
        {
            if (target == BuildTarget.iOS)
            {
                OnPostProcessBuildIOS(target, pathToBuiltProject);
            }
        }

        private static void OnPostProcessBuildIOS(BuildTarget target, string pathToBuiltProject)
        {
#if UNITY_IOS
            var projectPath = pathToBuiltProject + "/Unity-iPhone.xcodeproj/project.pbxproj";
            var project = new UnityEditor.iOS.Xcode.PBXProject();
            project.ReadFromString(File.ReadAllText(projectPath));

#if UNITY_2019_3_OR_NEWER
            var mainGuid = project.GetUnityMainTargetGuid();
            var targetGuid = project.GetUnityFrameworkTargetGuid();
            //Fix for
            //https://forum.unity.com/threads/2019-3-validation-on-upload-to-store-gives-unityframework-framework-contains-disallowed-file.751112/
            project.SetBuildProperty(mainGuid, "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES", "YES");
#else
            var name = UnityEditor.iOS.Xcode.PBXProject.GetUnityTargetName();
            var targetGuid = project.TargetGuidByName(name);
#endif
            if (!IS_COPPA_ENABLED)
            {
                project.AddFrameworkToProject(targetGuid, "AdSupport.framework", true);
                project.AddFrameworkToProject(targetGuid, "AppTrackingTransparency.framework", true);
            }

            var frameworkAbsolutePath = Path.Combine("Plugins", "DevToDev", "Analytics", "IOS");
            frameworkAbsolutePath = Path.Combine(Application.dataPath, frameworkAbsolutePath, UNITY_ANALYTICS_NAME);
            Debug.Log(frameworkAbsolutePath);
            AddAnalyticsFramework(pathToBuiltProject, project, targetGuid, frameworkAbsolutePath);
            File.WriteAllText(projectPath, project.WriteToString());
        }

        /*
         *             foreach (var framework in frameworks)
            {
                var destPath = Path.Combine(path, xcodeFrameworksFolder, framework);
                var frameworkAssets = AssetDatabase.FindAssets(framework);
                if (frameworkAssets.Length == 0)
                {
                    Debug.LogError($"Could not find {framework} in the project");
                }
                CopyDirectory(AssetDatabase.GUIDToAssetPath(frameworkAssets.First()), destPath);
                var fileGuid = project.AddFile(destPath, $"Frameworks/{framework}");
                var frameworksBuildPhaseGuid = project.GetFrameworksBuildPhaseByTarget(targetGuid);
                project.AddFileToBuildSection(targetGuid, frameworksBuildPhaseGuid, fileGuid);
                project.AddFileToEmbedFrameworks(targetGuid, fileGuid);
            }
         */
        private static void AddAnalyticsFramework(string projectPath, UnityEditor.iOS.Xcode.PBXProject project,
            string targetGuid,
            string frameworkPath)
        {
            var destinationFrameworkFilePath = Path.Combine(projectPath, "Frameworks", UNITY_ANALYTICS_NAME);
            // Copy framework
            DirectoryCopy(frameworkPath, destinationFrameworkFilePath, true);
            // Add declaration to .xcodeproj.

            var fileInBuild =
                project.AddFile($"Frameworks/{UNITY_ANALYTICS_NAME}", $"Frameworks/{UNITY_ANALYTICS_NAME}");
            var unityFrameworkLinkPhaseGuid = project.GetFrameworksBuildPhaseByTarget(targetGuid);

            project.AddFileToEmbedFrameworks(targetGuid, fileInBuild);
            //------------
            project.AddFileToBuildSection(targetGuid, unityFrameworkLinkPhaseGuid, fileInBuild);
            //------------

            project.AddBuildProperty(targetGuid, "FRAMEWORK_SEARCH_PATHS", "$(SRCROOT)/Frameworks");
            var defaultProperties = project.GetBuildPropertyForAnyConfig(targetGuid, "LD_RUNPATH_SEARCH_PATHS");
            project.SetBuildProperty(targetGuid, "LD_RUNPATH_SEARCH_PATHS", "/usr/lib/swift");
            if (defaultProperties != null)
            {
                foreach (var p in defaultProperties.Split(' '))
                {
                    project.AddBuildProperty(targetGuid, "LD_RUNPATH_SEARCH_PATHS", p);
                }
            }

            project.AddBuildProperty(targetGuid, "LD_RUNPATH_SEARCH_PATHS", "@executable_path/Frameworks");
            project.AddBuildProperty(targetGuid, "LD_RUNPATH_SEARCH_PATHS", "$(inherited)");
            var defaultLibraryProperties = project.GetBuildPropertyForAnyConfig(targetGuid, "LIBRARY_SEARCH_PATHS");
            project.SetBuildProperty(targetGuid, "LIBRARY_SEARCH_PATHS", "$(SDKROOT)/usr/lib/swift");
            project.AddBuildProperty(targetGuid, "LIBRARY_SEARCH_PATHS",
                "$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)");
            project.AddBuildProperty(targetGuid, "LIBRARY_SEARCH_PATHS",
                "$(TOOLCHAIN_DIR)/usr/lib/swift-5.0/$(PLATFORM_NAME)");

            var properties = defaultLibraryProperties.Split(' ');
            foreach (var property in properties)
            {
                project.AddBuildProperty(targetGuid, "LIBRARY_SEARCH_PATHS", property);
            }
            project.AddFrameworkToProject(targetGuid, UNITY_ANALYTICS_NAME, true);


#if !UNITY_2019_3_OR_NEWER
            project.SetBuildProperty(targetGuid, "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES", "YES");
#endif
#endif
        }

        /// <summary>
        /// Recursively directory copy.
        /// </summary>
        /// <param name="sourceDirName">Source dit path.</param>
        /// <param name="destDirName">Destination dir path.</param>
        /// <param name="copySubDirs">Copy sub directories?</param>
        /// <param name="specificExtensions">
        /// If not empty will be copied only files with specific extensions.
        /// Example of extension: ".dll"
        /// </param>
        // Source: https://docs.microsoft.com/en-us/dotnet/standard/io/how-to-copy-directories
        private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs,
            params string[] specificExtensions)
        {
            // Get the subdirectories for the specified directory.
            DirectoryInfo dir = new DirectoryInfo(sourceDirName);
            if (!dir.Exists)
            {
                throw new DirectoryNotFoundException(
                    "Source directory does not exist or could not be found: {sourceDirName}");
            }

            // Delete destination directory if exist.
            if (Directory.Exists(destDirName))
            {
                Directory.Delete(destDirName, true);
            }

            DirectoryInfo[] dirs = dir.GetDirectories();

            // If the destination directory doesn't exist, create it.       
            Directory.CreateDirectory(destDirName);

            FileInfo[] files = null;
            if (specificExtensions != null && specificExtensions.Length > 0)
            {
                // Get the files of the specific extensions in the directory.
                files = dir.GetFiles().Where(x => specificExtensions.Contains(x.Extension)).ToArray();
            }
            else
            {
                // Get the all files in the directory.
                files = dir.GetFiles();
            }

            files = files.Where(x => x.Extension != ".meta").Where(x=>x.Extension!=".DS_Store").ToArray();
            // Copy files to the new location
            foreach (FileInfo file in files)
            {
                string tempPath = Path.Combine(destDirName, file.Name);
                file.CopyTo(tempPath, false);
            }


            // If copying subdirectories, copy them and their contents to new location.
            if (copySubDirs)
            {
                foreach (DirectoryInfo subdir in dirs)
                {
                    string tempPath = Path.Combine(destDirName, subdir.Name);
                    DirectoryCopy(subdir.FullName, tempPath, copySubDirs, specificExtensions);
                }
            }
        }
    }
}