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
  Free: { name: "免费用户", icon: null, color: "default" },
  "Creator+": { name: "Creator+", icon: Crown, color: "warning" },
  ArtCircle: { name: "ArtCircle", icon: Star, color: "secondary" },
  VIP: { name: "VIP", icon: Zap, color: "success" }
};

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title = "视频内容",
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

  // 检查用户访问权限
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

  // 直接返回视频URL（已经是完整链接）
  const getVideoUrl = () => {
    if (!videoUrl) {
      return null;
    }
    return videoUrl;
  };

  // 处理播放事件
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
    console.log('视频URL:', videoUrl);
    console.log('错误详情:', error);
    setError('视频加载失败，请稍后重试');
  };

  const handleReady = () => {
    // ReactPlayer已准备就绪
  };

  // 升级会员提示
  const UpgradePrompt = () => {
    const requiredMembership = MEMBERSHIP_LEVELS[requiredLevel];
    const RequiredIcon = requiredMembership.icon;

    return (
      <div className="relative">
        {/* 缩略图背景 */}
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        )}

        {/* 遮罩层 */}
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
              <span className="text-white/80">需要</span>
              <Chip
                color={requiredMembership.color}
                variant="flat"
                startContent={RequiredIcon && <RequiredIcon className="w-4 h-4" />}
              >
                {requiredMembership.name}
              </Chip>
              <span className="text-white/80">及以上会员</span>
            </div>

            <Button
              color="primary"
              size="lg"
              onPress={onOpen}
              className="font-semibold"
            >
              升级会员观看
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 如果没有视频URL，显示错误信息
  if (!videoUrl) {
    return (
      <Card className={className}>
        <CardBody className="p-0">
          <div style={{ width, height }} className="flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 mb-2">视频文件不存在</p>
              <p className="text-sm text-gray-400">请检查视频文件是否已上传</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // 如果没有访问权限，显示升级提示
  if (!hasAccess) {
    return (
      <Card className={className}>
        <CardBody className="p-0">
          <div style={{ width, height }}>
            <UpgradePrompt />
          </div>
        </CardBody>

        {/* 升级会员模态框 */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalContent>
            <ModalHeader>升级会员</ModalHeader>
            <ModalBody>
              <p>升级到 {MEMBERSHIP_LEVELS[requiredLevel].name} 会员即可观看此内容</p>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-600">会员特权：</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 观看高清视频内容</li>
                  <li>• 下载优质素材</li>
                  <li>• 参与专属活动</li>
                  <li>• 获得更多积分奖励</li>
                </ul>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                取消
              </Button>
              <Button color="primary" onPress={onClose}>
                立即升级
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    );
  }

  // 有权限时显示视频播放器
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
                  重试
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
                // ReactPlayer开始加载
              }}
              onProgress={(progress) => {
                // 可以在这里处理播放进度
              }}
              config={{
                file: {
                  attributes: {
                    preload: 'metadata',
                    controlsList: 'nodownload',
                    disablePictureInPicture: false,
                    crossOrigin: 'anonymous' // 添加CORS支持
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