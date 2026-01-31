import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Globe, Mail, Phone, MapPin, Image,
  Save, Upload, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  getSiteSettings, updateSiteSettings, uploadImage
} from '@/services/firebase';
import type { SiteSettings } from '@/types';

const defaultSettings: SiteSettings = {
  id: 'default',
  siteName: 'Digital Emporium',
  tagline: 'Your Digital Success Partner',
  heroTitle: 'Transform Your Digital Vision',
  heroSubtitle: 'Into Reality',
  aboutText: 'We are a team of passionate digital experts dedicated to delivering exceptional results.',
  servicesText: 'Comprehensive digital solutions tailored to your business needs.',
  projectsText: 'Explore our portfolio of successful projects and case studies.',
  contactText: 'Get in touch with us to start your digital transformation journey.',
  logo: '',
  favicon: '',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  accentColor: '#ec4899',
  contactEmail: 'contact@digitalemporium.com',
  contactPhone: '+1 (555) 123-4567',
  contactAddress: '123 Innovation Street, Tech City, TC 12345',
  socialLinks: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    github: '',
    youtube: '',
  },
  contactInfo: {
    email: 'contact@digitalemporium.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Street, Tech City, TC 12345',
  },
  metaDescription: 'Digital Emporium - Premium digital services for your business growth',
  metaKeywords: 'digital services, web development, mobile apps, AI solutions, e-commerce',
  heroImages: [],
  servicesImages: [],
  testimonialsBackground: '',
  footerText: '© 2024 Digital Emporium. All rights reserved.',
  googleAnalyticsId: '',
  customScripts: '',
  carouselImages: [],
};

export function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSiteSettings();
      if (data) {
        setSettings(data);
        setLogoPreview(data.logo || '');
        setFaviconPreview(data.favicon || '');
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'favicon' | 'heroImages' | 'servicesImages' | 'testimonialsBackground'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      toast.loading('Uploading image...');
      const imageUrl = await uploadImage(file, `settings/${field}`);
      
      if (field === 'heroImages' || field === 'servicesImages') {
        setSettings(prev => ({
          ...prev,
          [field]: [...prev[field], imageUrl]
        }));
      } else {
        setSettings(prev => ({ ...prev, [field]: imageUrl }));
        if (field === 'logo') setLogoPreview(imageUrl);
        if (field === 'favicon') setFaviconPreview(imageUrl);
      }
      
      toast.dismiss();
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to upload image');
    }
  };

  const removeImage = (field: keyof SiteSettings, index?: number) => {
    if (field === 'heroImages' || field === 'servicesImages') {
      setSettings(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: '' }));
      if (field === 'logo') setLogoPreview('');
      if (field === 'favicon') setFaviconPreview('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSiteSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor' | 'accentColor', value: string) => {
    // Ensure the value is a valid hex color
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (value === '' || hexPattern.test(value)) {
      setSettings(prev => ({ ...prev, [colorType]: value }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Customize your website appearance and configuration</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
            />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="Digital Emporium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Your Digital Success Partner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
                  placeholder="© 2024 Digital Emporium. All rights reserved."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Logo & Favicon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Site Logo</Label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative group">
                        <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain rounded-lg border" />
                        <button
                          onClick={() => removeImage('logo')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                        <Image className="w-8 h-8" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    {faviconPreview ? (
                      <div className="relative group">
                        <img src={faviconPreview} alt="Favicon preview" className="w-10 h-10 object-contain rounded-lg border" />
                        <button
                          onClick={() => removeImage('favicon')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                        <Image className="w-5 h-5" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'favicon')}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      placeholder="#ec4899"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@digitalemporium.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address
                </Label>
                <Textarea
                  id="contactAddress"
                  value={settings.contactAddress}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactAddress: e.target.value }))}
                  placeholder="123 Innovation Street, Tech City, TC 12345"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Facebook URL"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, facebook: e.target.value } 
                  }))}
                />
                <Input
                  placeholder="Twitter URL"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, twitter: e.target.value } 
                  }))}
                />
                <Input
                  placeholder="Instagram URL"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, instagram: e.target.value } 
                  }))}
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, linkedin: e.target.value } 
                  }))}
                />
                <Input
                  placeholder="GitHub URL"
                  value={settings.socialLinks.github}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, github: e.target.value } 
                  }))}
                />
                <Input
                  placeholder="YouTube URL"
                  value={settings.socialLinks.youtube}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    socialLinks: { ...prev.socialLinks, youtube: e.target.value } 
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Brief description of your website for search engines"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended: 50-160 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={(e) => setSettings(prev => ({ ...prev, metaKeywords: e.target.value }))}
                  placeholder="digital services, web development, mobile apps"
                />
                <p className="text-sm text-muted-foreground">
                  Separate keywords with commas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Settings */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {settings.heroImages.map((image, index) => (
                  <div key={index} className="relative group aspect-video">
                    <img src={image} alt={`Hero ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage('heroImages', index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroImages')}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Section Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {settings.servicesImages.map((image, index) => (
                  <div key={index} className="relative group aspect-video">
                    <img src={image} alt={`Service ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage('servicesImages', index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'servicesImages')}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonials Background</CardTitle>
            </CardHeader>
            <CardContent>
              {settings.testimonialsBackground ? (
                <div className="relative group aspect-video max-w-md">
                  <img src={settings.testimonialsBackground} alt="Testimonials background" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage('testimonialsBackground')}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="aspect-video max-w-md border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Background</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'testimonialsBackground')}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-sm text-muted-foreground">
                  Enter your Google Analytics measurement ID
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customScripts">Custom Scripts</Label>
                <Textarea
                  id="customScripts"
                  value={settings.customScripts}
                  onChange={(e) => setSettings(prev => ({ ...prev, customScripts: e.target.value }))}
                  placeholder="Paste your custom JavaScript or tracking codes here"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  These scripts will be added to the &lt;head&gt; section of your website
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg border bg-gradient-to-br from-muted/30 to-background">
                <h3 className="text-lg font-semibold mb-4">Color Preview</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                    <span className="text-sm">Accent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
