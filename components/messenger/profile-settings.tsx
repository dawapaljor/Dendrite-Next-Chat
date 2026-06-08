'use client';

import React, { useState } from 'react';
import { User, Bell, Lock, HelpCircle, LogOut, Check, X, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSettings as ProfileSettingsType } from "./types";
import { translations, Language } from "@/lib/translations";

interface ProfileSettingsProps {
  settings: ProfileSettingsType;
  onSettingsChange: (updated: ProfileSettingsType) => void;
  onSave: () => void;
  isSaving?: boolean;
  hasSavedIndicator: boolean;
  appTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout?: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  onChangePassword?: (oldPass: string, newPass: string) => Promise<void>;
}

export default function ProfileSettings({
  settings,
  onSettingsChange,
  onSave,
  isSaving,
  hasSavedIndicator,
  appTheme,
  onToggleTheme,
  onLogout,
  lang,
  setLang,
  onChangePassword
}: ProfileSettingsProps) {

  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: 'error', message: lang === 'en' ? 'All fields are required.' : 'ཡིག་ཆ་ཚང་མ་སྐོང་དགོས།' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: lang === 'en' ? 'New passwords do not match.' : 'གསང་ཚིག་གསར་པ་གཉིས་མི་མཐུན།' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: lang === 'en' ? 'Password must be at least 6 characters.' : 'གསང་ཚིག་ཉུང་མཐར་ཡི་གེ་༦དགོས།' });
      return;
    }

    setIsChangingPassword(true);
    setPasswordStatus(null);
    try {
      if (onChangePassword) {
        await onChangePassword(oldPassword, newPassword);
        setPasswordStatus({ type: 'success', message: lang === 'en' ? 'Password changed successfully!' : 'གསང་ཚིག་ལམ་ལྷོངས་ངང་བསྒྱུར་ཚར།' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        throw new Error('onChangePassword handler not provided');
      }
    } catch (err: any) {
      const errMsg = err?.message || err?.errcode || 'Unknown error';
      setPasswordStatus({
        type: 'error',
        message: lang === 'en'
          ? `Failed to change password: ${errMsg}`
          : `གསང་ཚིག་བསྒྱུར་མ་ཐུབ།: ${errMsg}`
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleFieldChange = (key: keyof ProfileSettingsType, val: any) => {
    onSettingsChange({
      ...settings,
      [key]: val
    });
  };

  const t = translations[lang];

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Settings Panel Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="  text-brand rounded-md">
            <User className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm tracking-tight">{t.activeSettings}</h3>
        </div>

        {/* Dynamic Save button */}
        <button
          onClick={onSave}
          disabled={isSaving || hasSavedIndicator}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 disabled:cursor-not-allowed shadow-md cursor-pointer ${hasSavedIndicator
            ? 'bg-emerald-500 text-white animate-success-pop shadow-emerald-500/20'
            : isSaving
              ? 'animate-save-shimmer animate-save-pulse text-white shadow-brand/20 opacity-90'
              : 'bg-brand text-brand-foreground hover:bg-brand-hover hover:shadow-[0_0_12px_rgba(115,115,115,0.4)] shadow-brand/10'
            }`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{lang === 'en' ? 'Saving...' : 'ཉར་ཚགས་བྱེད་བཞིན་པ།...'}</span>
            </>
          ) : hasSavedIndicator ? (
            <>
              <Check className="h-3.5 w-3.5 animate-bounce" />
              <span>{t.saved}</span>
            </>
          ) : (
            <span>{t.saveChanges}</span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full bg-muted/10">
        <div className="p-4 space-y-4">

          {/* Avatar and Info Card */}
          <Card className="border border-muted-foreground/10 shadow-xs rounded-xl overflow-hidden bg-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="relative mb-2 group cursor-pointer" onClick={() => setIsPickerOpen(true)}>
                <Avatar className="h-16 w-16 border-2 border-brand/20 group-hover:border-brand transition duration-200 rounded-full">
                  <AvatarImage src={settings.avatarUrl} alt="Me" className="object-cover animate-fade-in rounded-full" />
                  <AvatarFallback className="bg-brand-light text-brand-light-foreground text-sm font-bold rounded-full flex items-center justify-center">
                    {settings.username ? settings.username.substring(0, 2).toUpperCase() : 'ME'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 text-[8px] font-bold text-center p-1 select-none">
                  {t.changeAvatar}
                </div>
              </div>
              <h4 className="font-bold text-sm text-foreground">{settings.username}</h4>
              <p className="text-[10px] text-muted-foreground text-center">{settings.role}</p>
            </CardContent>
          </Card>

          {/* ── Section: Identity Coordinates ── */}
          <div className="space-y-3.5 pt-4 border-t border-border/10">
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-1 block">
              {t.identityCoordinates}
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1.5 block uppercase tracking-widest">{t.displayName}</label>
                <Input
                  type="text"
                  value={settings.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1.5 block uppercase tracking-widest">{t.professionalTitle}</label>
                <Input
                  type="text"
                  value={settings.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1.5 block uppercase tracking-widest">{t.emailAddress}</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1.5 block uppercase tracking-widest">{t.routingPhone}</label>
                <Input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Security Preferences ── */}
          <div className="space-y-3.5 pt-4 border-t border-border/10">
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-1 block">
              {lang === 'en' ? 'Security Preferences' : 'བདེ་འཇགས་སྒྲིག་བཀོད།'}
            </span>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <h5 className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                 <Lock className="w-3.5 h-3.5 text-brand" />
                 {lang === 'en' ? 'Change Password' : 'གསང་ཚིག་བསྒྱུར་བ།'}
              </h5>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground/80 mb-1.5 block uppercase tracking-widest">
                    {lang === 'en' ? 'Current Password' : 'ད་ལྟའི་གསང་ཚིག'}
                  </label>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="text-xs h-9 bg-card pr-8"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer bg-transparent border-0 outline-none flex items-center justify-center"
                    >
                      {showOldPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground/80 mb-1.5 block uppercase tracking-widest">
                    {lang === 'en' ? 'New Password' : 'གསང་ཚིག་གསར་པ།'}
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="text-xs h-9 bg-card pr-8"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer bg-transparent border-0 outline-none flex items-center justify-center"
                    >
                      {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground/80 mb-1.5 block uppercase tracking-widest">
                    {lang === 'en' ? 'Confirm New Password' : 'གསང་ཚིག་གསར་པ་བསྐྱར་ལྡབ།'}
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="text-xs h-9 bg-card pr-8"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer bg-transparent border-0 outline-none flex items-center justify-center"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordStatus && (
                <p className={`text-[10px] font-semibold ${passwordStatus.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {passwordStatus.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isChangingPassword}
                className={`w-full h-9 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 disabled:cursor-not-allowed shadow-md cursor-pointer ${isChangingPassword
                  ? 'animate-save-shimmer animate-save-pulse text-white shadow-brand/20 opacity-90'
                  : 'bg-brand text-brand-foreground hover:bg-brand-hover hover:shadow-[0_0_12px_rgba(115,115,115,0.4)] shadow-brand/10'
                  }`}
              >
                {isChangingPassword ? (
                  <>
                    <svg className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{lang === 'en' ? 'Updating...' : 'གསར་སྒྱུར་བྱེད་བཞིན་པ།...'}</span>
                  </>
                ) : (
                  lang === 'en' ? 'Update Password' : 'གསང་ཚིག་གསར་སྒྱུར།'
                )}
              </button>
            </form>
          </div>

          {/* ── Section: System Preferences ── */}
          <div className="space-y-3.5 pt-4 border-t border-border/10">
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-1 block">
              {t.systemPreferences}
            </span>

            <div className="rounded-xl divide-y divide-border/10 border border-border/10 overflow-hidden">
              {/* Dark Mode toggle */}
              <div
                className="px-3 py-3 flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition"
                onClick={onToggleTheme}
              >
                <div>
                  <h5 className="font-semibold text-xs text-foreground">{t.darkMode}</h5>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{t.toggleThemeDesc}</p>
                </div>
                 <div className={`w-8 h-4.5 rounded-full p-0.5 transition duration-150 shrink-0 ${appTheme === 'dark' ? 'bg-brand' : 'bg-muted-foreground/40'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition duration-150 shadow-sm ${appTheme === 'dark' ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Receipts toggle */}
              <div
                className="px-3 py-3 flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition"
                onClick={() => handleFieldChange('readReceipts', !settings.readReceipts)}
              >
                <div>
                  <h5 className="font-semibold text-xs text-foreground">{t.readReceipts}</h5>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{t.broadcastReceiptsDesc}</p>
                </div>
                 <div className={`w-8 h-4.5 rounded-full p-0.5 transition duration-150 shrink-0 ${settings.readReceipts ? 'bg-brand' : 'bg-muted-foreground/40'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition duration-150 shadow-sm ${settings.readReceipts ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Two-factor toggle */}
              <div
                className="px-3 py-3 flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition"
                onClick={() => handleFieldChange('twoFactor', !settings.twoFactor)}
              >
                <div>
                  <h5 className="font-semibold text-xs text-foreground">{t.twoFactor}</h5>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{t.twoFactorDesc}</p>
                </div>
                 <div className={`w-8 h-4.5 rounded-full p-0.5 transition duration-150 shrink-0 ${settings.twoFactor ? 'bg-brand' : 'bg-muted-foreground/40'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition duration-150 shadow-sm ${settings.twoFactor ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Language selection dropdown */}
              <div className="px-3 py-3 flex justify-between items-center">
                <div>
                  <h5 className="font-semibold text-xs text-foreground">{t.language}</h5>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{t.toggleLanguage}</p>
                </div>
                <select
                  value={lang}
                  onChange={(e) => {
                    const newLang = e.target.value as Language;
                    setLang(newLang);
                    localStorage.setItem('app_language', newLang);
                    handleFieldChange('language', newLang === 'en' ? 'English (United States)' : 'Tibetan');
                  }}
                   className="bg-card border border-muted-foreground/20 rounded-md text-xs p-1 focus:ring-1 focus:ring-brand outline-none text-foreground shrink-0"
                >
                  <option value="en">English</option>
                  <option value="bo">བོད་སྐད། (Tibetan)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Section: More ── */}
          <div className="space-y-1 pt-4 border-t border-border/10">
            <div className="px-3 py-3 rounded-lg hover:bg-muted/10 transition duration-150 flex items-center gap-1.5 text-xs cursor-pointer">
              <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-muted-foreground hover:text-foreground">{t.privacyRegulations}</span>
            </div>
            <div className="px-3 py-3 rounded-lg hover:bg-muted/10 transition duration-150 flex items-center gap-1.5 text-xs cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-muted-foreground hover:text-foreground">{t.supportCenter}</span>
            </div>
            {onLogout && (
              <div
                onClick={onLogout}
                className="mt-4 px-3 py-3 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition duration-150 flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-medium text-rose-500">{t.logoutSession}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {isPickerOpen && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xs z-50 flex flex-col justify-end md:justify-center p-4">
          <div className="bg-card border border-muted/50 rounded-2xl shadow-xl flex flex-col max-h-[80%] max-w-sm mx-auto w-full overflow-hidden animate-in slide-in-from-bottom duration-250">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center bg-card">
              <h4 className="font-bold text-xs">{t.changeAvatar}</h4>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 hover:bg-muted rounded-full transition text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Modal Grid Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/5">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 105 }, (_, i) => `/avatar/peep-${i + 1}.svg`).map((avUrl, idx) => {
                  const isSelected = settings.avatarUrl === avUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleFieldChange('avatarUrl', avUrl);
                        setIsPickerOpen(false);
                      }}
                      className={`aspect-square w-full rounded-full transition border active:scale-95 flex items-center justify-center relative bg-card overflow-hidden ${isSelected
                        ? 'border-brand bg-brand-light'
                        : 'border-muted-foreground/15 hover:border-brand/40 hover:bg-muted/10'
                        }`}
                    >
                      <img src={avUrl} alt={`Avatar ${idx + 1}`} className="w-[120%] h-[120%] object-contain mt-2" />
                      {isSelected && (
                        <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-brand text-brand-foreground rounded-full flex items-center justify-center p-0.5 shadow-sm">
                          <Check className="h-2 w-2" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
