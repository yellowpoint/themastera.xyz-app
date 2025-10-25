"use client";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { Play, Lock, Crown, Star, Zap } from "lucide-react";

const MEMBERSHIP_LEVELS = {
  Free: { name: "Free User", icon: null, color: "default" },
  "Creator+": { name: "Creator+", icon: Crown, color: "warning" },
  ArtCircle: { name: "ArtCircle", icon: Star, color: "secondary" },
  VIP: { name: "VIP", icon: Zap, color: "success" }
};

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title = "Video Content",
  description,
  isPremium = false,
  requiredLevel = "Free",
  userLevel = "Free",
  width = "100%",
  height = "400px",
  className = "",
  onPlay,
  onPause,
  onEnded,
  showControls = true,
  autoPlay = false,
  muted = false
}) {
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Check user access
  useEffect(() => {
    const checkAccess = () => {
      if (!isPremium) {
        setHasAccess(true);
        return;
      }

      const levelHierarchy = ["Free", "Creator+", "ArtCircle", "VIP"];
      const userLevelIndex = levelHierarchy.indexOf(userLevel);
      const requiredLevelIndex = levelHierarchy.indexOf(requiredLevel);

      setHasAccess(userLevelIndex >= requiredLevelIndex);
    };

    checkAccess();
  }, [isPremium, userLevel, requiredLevel]);

  // Directly return the video URL (already a full link)
  const getVideoUrl = () => {
    if (!videoUrl) {
      return null;
    }
    return videoUrl;
  };

  // Handle play event
  const handlePlay = () => {
    onPlay && onPlay();
  };

  const handlePause = () => {
    onPause && onPause();
  };

  const handleEnded = () => {
    onEnded && onEnded();
  };

  const handleError = (error) => {
    console.log('Video URL:', videoUrl);
    console.log('Error details:', error);
    setError('Video failed to load, please try again later');
  };

  const handleReady = () => {
    // ReactPlayer is ready
  };

  // Upgrade membership prompt
  const UpgradePrompt = () => {
    const requiredMembership = MEMBERSHIP_LEVELS[requiredLevel];
    const RequiredIcon = requiredMembership.icon;

    return (
      <div className="relative">
        {/* Thumbnail background */}
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        )}

        {/* Mask layer */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-bold text-white">{title}</h3>

            {description && (
              <p className="text-white/80 text-sm max-w-md">{description}</p>
            )}

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-white/80">Requires</span>
              <Chip
                color={requiredMembership.color}
                variant="flat"
                startContent={RequiredIcon && <RequiredIcon className="w-4 h-4" />}
              >
                {requiredMembership.name}
              </Chip>
              <span className="text-white/80">and above</span>
            </div>

            <Button
              color="primary"
              size="lg"
              onPress={onOpen}
              className="font-semibold"
            >
              Upgrade to Watch
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // If there is no video URL, display an error message
  if (!videoUrl) {
    return (
      <Card className={className}>
        <CardBody className="p-0">
          <div style={{ width, height }} className="flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Video file does not exist</p>
              <p className="text-sm text-gray-400">Please check if the video file has been uploaded</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // If there is no access, display the upgrade prompt
  if (!hasAccess) {
    return (
      <Card className={className}>
        <CardBody className="p-0">
          <div style={{ width, height }}>
            <UpgradePrompt />
          </div>
        </CardBody>

        {/* Upgrade membership modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalContent>
            <ModalHeader>Upgrade Membership</ModalHeader>
            <ModalBody>
              <p>Upgrade to {MEMBERSHIP_LEVELS[requiredLevel].name} to watch this content</p>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-600">Membership privileges:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Watch HD video content</li>
                  <li>• Download high-quality materials</li>
                  <li>• Participate in exclusive events</li>
                  <li>• Get more points rewards</li>
                </ul>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onClose}>
                Upgrade Now
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    );
  }

  // Show video player when there is access
  return (
    <Card className='rounded-none'>
      <CardBody className="p-0 bg-black ">
        <div style={{ width, height }} className="relative">

          {error ? (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <div className="text-center">
                <p className="text-red-500 mb-2">{error}</p>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => {
                    setError(null);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <ReactPlayer
              src={getVideoUrl()}
              width="100%"
              height="100%"
              controls={showControls}
              playing={autoPlay}
              muted={muted}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={handleError}
              onReady={handleReady}
              onLoadStart={() => {
                // ReactPlayer starts loading
              }}
              onProgress={(progress) => {
                // You can handle playback progress here
              }}
              config={{
                file: {
                  attributes: {
                    preload: 'metadata',
                    controlsList: 'nodownload',
                    disablePictureInPicture: false,
                    crossOrigin: 'anonymous' // Add CORS support
                  },
                  forceVideo: true
                }
              }}
            // style={{
            //   borderRadius: '8px',
            //   overflow: 'hidden'
            // }}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}