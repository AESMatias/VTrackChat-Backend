import { Request, Response } from 'express';
import semver from 'semver'; // This package is used to compare version numbers!

const PORT = process.env.PORT || 3000;

const versions = {
    android: {
        latestVersion: "1.3.0",
        mandatory: true,
        releaseNotes: "What's new in 1.3.0: Improvements and bug fixes."
    },
};

export const getCurrentVersion = async (req: Request, res: Response): Promise<void> => {
// app.get("/VTrackApp/:platform/versions/:currentVersion/check-update", (req, res) => {
    const { platform, currentVersion } = req.params;

    //  Validate platform
    if (!versions[platform]) {
        return res.status(400).json({ error: "Invalid platform" });
    }

    const latestVersion = versions[platform].latestVersion;
    const mandatory = versions[platform].mandatory;
    const releaseNotes = versions[platform].releaseNotes;

    // Validate the current version
    if (!semver.valid(currentVersion)) {
        return res.status(400).json({ error: "Invalid current version format" });
    }

    // Compare versions using semver
    const updateAvailable = semver.lt(currentVersion, latestVersion); // Checks if the current version is lower than the latest version
    const criticalUpdate = mandatory; // This would be true if a critical update is required

    res.json({
        latestVersion,
        mandatory,
        updateAvailable,
        criticalUpdate,
        releaseNotes
    });
    
};