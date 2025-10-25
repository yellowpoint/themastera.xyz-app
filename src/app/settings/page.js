'use client'

import { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Switch,
  Input,
  Select,
  SelectItem,
  Slider,
  Tabs,
  Tab,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Avatar,
  Textarea
} from '@heroui/react'
import { AlertTriangle } from 'lucide-react'
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure()

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    username: "Master Creator",
    email: "creator@mastera.com",
    phone: "+86 138****8888",
    bio: "Digital artist passionate about creation",
    location: "Shanghai, China",
    website: "https://myportfolio.com",
    language: "en-US",
    timezone: "Asia/Shanghai",
    profileVisibility: "public"
  })

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowFollows: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: true,
    thirdPartySharing: false
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newFollowers: true,
    newLikes: true,
    newComments: true,
    newMessages: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    notificationSound: true,
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00"
  })

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: "dark",
    fontSize: 16,
    language: "en-US",
    autoPlay: true,
    highQuality: true,
    reducedMotion: false,
    colorBlindMode: false,
    compactMode: false
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    deviceTracking: true,
    suspiciousActivity: true,
    passwordStrength: "strong",
    lastPasswordChange: "2024-01-01",
    activeSessions: 3
  })

  const handleSaveSettings = (category) => {
    console.log(`Saving ${category} settings`)
    // Add save logic here
  }

  const handleDeleteAccount = () => {
    console.log('Deleting account')
    onDeleteClose()
  }

  const handleChangePassword = () => {
    console.log('Changing password')
    onPasswordClose()
  }

  const languages = [
    { key: "zh-CN", label: "Simplified Chinese" },
    { key: "zh-TW", label: "Traditional Chinese" },
    { key: "en-US", label: "English" },
    { key: "ja-JP", label: "Japanese" },
    { key: "ko-KR", label: "Korean" }
  ]

  const timezones = [
    { key: "Asia/Shanghai", label: "Beijing Time (UTC+8)" },
    { key: "Asia/Tokyo", label: "Tokyo Time (UTC+9)" },
    { key: "America/New_York", label: "New York Time (UTC-5)" },
    { key: "Europe/London", label: "London Time (UTC+0)" },
    { key: "America/Los_Angeles", label: "Los Angeles Time (UTC-8)" }
  ]

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card className="bg-content1 border-divider">
              <CardBody className="p-0">
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab}
                  orientation="vertical"
                  className="w-full"
                  color="primary"
                >
                  <Tab key="account" title="Account Settings" />
                  <Tab key="privacy" title="Privacy Settings" />
                  <Tab key="notifications" title="Notification Settings" />
                  <Tab key="display" title="Display Settings" />
                  <Tab key="security" title="Security Settings" />
                </Tabs>
              </CardBody>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">Basic Information</h2>
                   </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar
                        src="/api/placeholder/80/80"
                        className="w-20 h-20"
                      />
                      <div>
                        <Button color="primary" variant="bordered" size="sm">
                          Change Avatar
                        </Button>
                        <p className="text-xs text-gray-400 mt-1">
                          Supports JPG, PNG formats, max 5MB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Username"
                        value={accountSettings.username}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          username: e.target.value
                        })}
                      />

                      <Input
                        label="Email Address"
                        type="email"
                        value={accountSettings.email}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          email: e.target.value
                        })}
                      />

                      <Input
                        label="Phone Number"
                        value={accountSettings.phone}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          phone: e.target.value
                        })}
                      />

                      <Input
                        label="Location"
                        value={accountSettings.location}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          location: e.target.value
                        })}
                      />

                      <Input
                        label="Personal Website"
                        value={accountSettings.website}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          website: e.target.value
                        })}
                      />

                      <Select
                        label="Language"
                        selectedKeys={[accountSettings.language]}
                        onSelectionChange={(keys) => setAccountSettings({
                          ...accountSettings,
                          language: Array.from(keys)[0]
                        })}
                      >
                        {languages.map((lang) => (
                          <SelectItem key={lang.key} value={lang.key}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <Textarea
                      label="Bio"
                      value={accountSettings.bio}
                      onChange={(e) => setAccountSettings({
                        ...accountSettings,
                        bio: e.target.value
                      })}
                      minRows={3}
                    />

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('account')}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">Account Actions</h2>
                   </CardHeader>
                   <CardBody className="space-y-4">
                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold">Change Password</h3>
                         <p className="text-sm text-gray-400">Regularly update your password to keep your account secure</p>
                       </div>
                       <Button
                         color="primary"
                         variant="bordered"
                         onPress={onPasswordOpen}
                       >
                         Change Password
                       </Button>
                     </div>

                     <Divider />

                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold text-red-400">Delete Account</h3>
                         <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                       </div>
                       <Button
                         color="danger"
                         variant="bordered"
                         onPress={onDeleteOpen}
                       >
                         Delete Account
                       </Button>
                     </div>
                   </CardBody>
                 </Card>
               </div>
             )}

             {/* Privacy Settings */}
             {activeTab === 'privacy' && (
               <div className="space-y-6">
                 <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">Profile Privacy</h2>
                   </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Public Profile</h3>
                        <p className="text-sm text-gray-400">Allow other users to view your profile</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.profilePublic}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          profilePublic: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Show Email Address</h3>
                        <p className="text-sm text-gray-400">Display email address on your profile</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.showEmail}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          showEmail: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Show Phone Number</h3>
                        <p className="text-sm text-gray-400">Display phone number on your profile</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.showPhone}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          showPhone: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Show Online Status</h3>
                        <p className="text-sm text-gray-400">Let other users see when you're online</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.showOnlineStatus}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          showOnlineStatus: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">Interaction Permissions</h2>
                   </CardHeader>
                   <CardBody className="space-y-4">
                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold">Allow Messages</h3>
                         <p className="text-sm text-gray-400">Allow other users to send you private messages</p>
                       </div>
                       <Switch
                         isSelected={privacySettings.allowMessages}
                         onValueChange={(value) => setPrivacySettings({
                           ...privacySettings,
                           allowMessages: value
                         })}
                       />
                     </div>

                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold">Allow Follows</h3>
                         <p className="text-sm text-gray-400">Allow other users to follow you</p>
                       </div>
                       <Switch
                         isSelected={privacySettings.allowFollows}
                         onValueChange={(value) => setPrivacySettings({
                           ...privacySettings,
                           allowFollows: value
                         })}
                       />
                     </div>
                   </CardBody>
                 </Card>

                 <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Data Usage</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Data Collection</h3>
                        <p className="text-sm text-gray-400">Allow collection of usage data to improve services</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.dataCollection}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          dataCollection: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Analytics Tracking</h3>
                        <p className="text-sm text-gray-400">Allow usage tracking with analytics tools</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.analyticsTracking}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          analyticsTracking: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Third-Party Sharing</h3>
                        <p className="text-sm text-gray-400">Allow sharing anonymous data with partners</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.thirdPartySharing}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          thirdPartySharing: value
                        })}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('privacy')}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Notification Methods</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.emailNotifications}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Push Notifications</h3>
                        <p className="text-sm text-gray-400">Receive notifications via browser push</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.pushNotifications}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">SMS Notifications</h3>
                        <p className="text-sm text-gray-400">Receive important notifications via SMS</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.smsNotifications}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Notification Content</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">New Followers</h3>
                        <p className="text-sm text-gray-400">Notify when someone follows you</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newFollowers}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newFollowers: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">New Likes</h3>
                        <p className="text-sm text-gray-400">Notify when your work gets liked</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newLikes}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newLikes: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">New Comments</h3>
                        <p className="text-sm text-gray-400">Notify when your work receives comments</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newComments}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newComments: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">New Messages</h3>
                        <p className="text-sm text-gray-400">Notify when you receive private messages</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newMessages}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newMessages: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">System Updates</h3>
                        <p className="text-sm text-gray-400">System updates and maintenance notifications</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.systemUpdates}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          systemUpdates: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Marketing Emails</h3>
                        <p className="text-sm text-gray-400">Receive product updates and promotional information</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.marketingEmails}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          marketingEmails: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Weekly Digest</h3>
                        <p className="text-sm text-gray-400">Send weekly activity summary emails</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.weeklyDigest}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          weeklyDigest: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Do Not Disturb</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Notification Sound</h3>
                        <p className="text-sm text-gray-400">Play notification sound</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.notificationSound}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          notificationSound: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Quiet Hours</h3>
                        <p className="text-sm text-gray-400">Do not receive notifications during specified period</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.quietHours}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          quietHours: value
                        })}
                      />
                    </div>

                    {notificationSettings.quietHours && (
                      <div className="grid grid-cols-2 gap-4 ml-4">
                        <Input
                          label="Start Time"
                          type="time"
                          value={notificationSettings.quietStart}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            quietStart: e.target.value
                          })}
                        />
                        <Input
                          label="End Time"
                          type="time"
                          value={notificationSettings.quietEnd}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            quietEnd: e.target.value
                          })}
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('notifications')}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Appearance Settings</h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Theme</h3>
                      <div className="flex gap-4">
                        <Button
                          variant={displaySettings.theme === 'light' ? 'solid' : 'bordered'}
                          onPress={() => setDisplaySettings({ ...displaySettings, theme: 'light' })}
                        >
                          Light Theme
                        </Button>
                        <Button
                          variant={displaySettings.theme === 'dark' ? 'solid' : 'bordered'}
                          onPress={() => setDisplaySettings({ ...displaySettings, theme: 'dark' })}
                        >
                          Dark Theme
                        </Button>
                        <Button
                          variant={displaySettings.theme === 'auto' ? 'solid' : 'bordered'}
                          onPress={() => setDisplaySettings({ ...displaySettings, theme: 'auto' })}
                        >
                          System Default
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Font Size: {displaySettings.fontSize}px</h3>
                      <Slider
                        value={displaySettings.fontSize}
                        onChange={(value) => setDisplaySettings({ ...displaySettings, fontSize: value })}
                        minValue={12}
                        maxValue={24}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <Select
                      label="Interface Language"
                      selectedKeys={[displaySettings.language]}
                      onSelectionChange={(keys) => setDisplaySettings({
                        ...displaySettings,
                        language: Array.from(keys)[0]
                      })}
                    >
                      {languages.map((lang) => (
                        <SelectItem key={lang.key} value={lang.key}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Content Display</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Auto-play Videos</h3>
                        <p className="text-sm text-gray-400">Automatically play video content while browsing</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.autoPlay}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          autoPlay: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">High Quality Images</h3>
                        <p className="text-sm text-gray-400">Prioritize loading high-quality images</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.highQuality}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          highQuality: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Compact Mode</h3>
                        <p className="text-sm text-gray-400">Use a more compact interface layout</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.compactMode}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          compactMode: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Accessibility Settings</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Reduce Motion</h3>
                        <p className="text-sm text-gray-400">Reduce UI animation effects</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.reducedMotion}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          reducedMotion: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Colorblind Friendly Mode</h3>
                        <p className="text-sm text-gray-400">Enable colorblind friendly color schemes</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.colorBlindMode}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          colorBlindMode: value
                        })}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('display')}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Account Security</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-400">Add extra security to your account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip
                          color={securitySettings.twoFactorAuth ? "success" : "default"}
                          variant="flat"
                          size="sm"
                        >
                          {securitySettings.twoFactorAuth ? "Enabled" : "Disabled"}
                        </Chip>
                        <Button
                          color="primary"
                          variant="bordered"
                          size="sm"
                        >
                          {securitySettings.twoFactorAuth ? "Manage" : "Enable"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Login Alerts</h3>
                        <p className="text-sm text-gray-400">Send alerts on new device logins</p>
                      </div>
                      <Switch
                        isSelected={securitySettings.loginAlerts}
                        onValueChange={(value) => setSecuritySettings({
                          ...securitySettings,
                          loginAlerts: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Device Tracking</h3>
                        <p className="text-sm text-gray-400">Record login device information</p>
                      </div>
                      <Switch
                        isSelected={securitySettings.deviceTracking}
                        onValueChange={(value) => setSecuritySettings({
                          ...securitySettings,
                          deviceTracking: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Suspicious Activity Monitoring</h3>
                        <p className="text-sm text-gray-400">Monitor and alert on suspicious login activities</p>
                      </div>
                      <Switch
                        isSelected={securitySettings.suspiciousActivity}
                        onValueChange={(value) => setSecuritySettings({
                          ...securitySettings,
                          suspiciousActivity: value
                        })}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Session Timeout</h3>
                      <Select
                        selectedKeys={[securitySettings.sessionTimeout.toString()]}
                        onSelectionChange={(keys) => setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: parseInt(Array.from(keys)[0])
                        })}
                      >
                        <SelectItem key="15" value="15">15 minutes</SelectItem>
                        <SelectItem key="30" value="30">30 minutes</SelectItem>
                        <SelectItem key="60" value="60">1 hour</SelectItem>
                        <SelectItem key="240" value="240">4 hours</SelectItem>
                        <SelectItem key="480" value="480">8 hours</SelectItem>
                      </Select>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Password Security</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Password Strength</h3>
                        <p className="text-sm text-gray-400">Current password security level</p>
                      </div>
                      <Chip
                        color={securitySettings.passwordStrength === 'strong' ? 'success' : 'warning'}
                        variant="flat"
                      >
                        {securitySettings.passwordStrength === 'strong' ? 'Strong' : 'Medium'}
                      </Chip>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Last Password Change</h3>
                        <p className="text-sm text-gray-400">{securitySettings.lastPasswordChange}</p>
                      </div>
                      <Button
                        color="primary"
                        variant="bordered"
                        onPress={onPasswordOpen}
                      >
                        Change Password
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Active Sessions</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-400">
                        Currently {securitySettings.activeSessions} active sessions
                      </p>
                      <Button color="danger" variant="bordered" size="sm">
                        Terminate All Sessions
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-content2 rounded-lg">
                        <div>
                          <p className="font-semibold">Current Device (Windows)</p>
                          <p className="text-sm text-gray-400">Shanghai, China • Active just now</p>
                        </div>
                        <Chip color="success" variant="flat" size="sm">
                          Current
                        </Chip>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-content2 rounded-lg">
                        <div>
                          <p className="font-semibold">iPhone</p>
                          <p className="text-sm text-gray-400">Shanghai, China • 2 hours ago</p>
                        </div>
                        <Button color="danger" variant="light" size="sm">
                          Terminate
                        </Button>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-content2 rounded-lg">
                        <div>
                          <p className="font-semibold">Chrome (Mac)</p>
                          <p className="text-sm text-gray-400">Beijing, China • 1 day ago</p>
                        </div>
                        <Button color="danger" variant="light" size="sm">
                          Terminate
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('security')}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={isPasswordOpen}
        onClose={onPasswordClose}
        className="bg-content1"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Change Password</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter your current password"
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Enter your new password"
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Please enter the new password again"
              />

              <div className="text-sm text-gray-400">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>At least 8 characters</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Contains numbers</li>
                  <li>Contains special characters</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPasswordClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleChangePassword}>
              Confirm Change
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        className="bg-content1"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold text-red-400">Delete Account</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Warning
                </h3>
                <p className="text-sm text-gray-300">
                  Deleting your account is an irreversible action. You will lose:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300 space-y-1">
                  <li>All personal profile and settings</li>
                  <li>All created content and works</li>
                  <li>All followers and following relationships</li>
                  <li>All points and level progress</li>
                  <li>All history and data</li>
                </ul>
              </div>

              <Input
                label="Confirm Deletion"
                placeholder="Please enter 'Delete my account' to confirm"
              />

              <Input
                label="Password Confirmation"
                type="password"
                placeholder="Please enter your password"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteAccount}>
              Confirm Deletion
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}