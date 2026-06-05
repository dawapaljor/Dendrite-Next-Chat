'use client';

import React from 'react';
import { User, Bell, Lock, HelpCircle, LogOut, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSettings as ProfileSettingsType } from "./types";

interface ProfileSettingsProps {
  settings: ProfileSettingsType;
  onSettingsChange: (updated: ProfileSettingsType) => void;
  onSave: () => void;
  hasSavedIndicator: boolean;
  appTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export default function ProfileSettings({
  settings,
  onSettingsChange,
  onSave,
  hasSavedIndicator,
  appTheme,
  onToggleTheme,
  onLogout
}: ProfileSettingsProps) {

  const handleFieldChange = (key: keyof ProfileSettingsType, val: any) => {
    onSettingsChange({
      ...settings,
      [key]: val
    });
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Settings Panel Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-[#0076FF] dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
            <User className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-sm tracking-tight">Active Settings & Profile</h3>
        </div>
        
        {/* Dynamic Save button */}
        <button
          onClick={onSave}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
            hasSavedIndicator 
              ? 'bg-emerald-500 text-white' 
              : 'bg-[#0076FF] text-white hover:bg-blue-600'
          }`}
        >
          {hasSavedIndicator ? (
            <>
              <Check className="h-3 w-3" />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full bg-muted/10">
        <div className="p-4 space-y-4">
          
          {/* Avatar and Info Card */}
          <Card className="border border-muted-foreground/10 shadow-xs rounded-xl overflow-hidden bg-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="relative mb-2">
                <Avatar className="h-16 w-16 border-2 border-[#0076FF]/20">
                  <AvatarImage src={settings.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"} alt="Me" className="object-cover animate-fade-in" />
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                    {settings.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h4 className="font-bold text-sm text-foreground">{settings.username}</h4>
              <p className="text-[10px] text-muted-foreground text-center">{settings.role}</p>
            </CardContent>
          </Card>

          {/* Profile form section */}
          <div className="space-y-3.5">
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-1 block">
              Identity Coordinates
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1 block">DISPLAY NAME</label>
                <Input
                  type="text"
                  value={settings.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1 block">PROFESSIONAL TITLE</label>
                <Input
                  type="text"
                  value={settings.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1 block">EMAIL ADDRESS</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground/80 mb-1 block">ROUTING PHONE</label>
                <Input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="text-xs h-9 bg-card"
                />
              </div>
            </div>
          </div>

          {/* Settings switch preferences */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-1 block">
              System Preferences
            </span>

            <div className="bg-card border border-muted/50 rounded-xl divide-y">
              {/* Dark Mode toggle */}
              <div 
                className="p-3 flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition"
                onClick={onToggleTheme}
              >
                <div>
                  <h5 className="font-semibold text-xs text-foreground">Dark Mode</h5>
                  <p className="text-[9px] text-muted-foreground">Toggle application display appearance theme</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full p-0.5 transition duration-150 ${appTheme === 'dark' ? 'bg-[#0076FF]' : 'bg-muted-foreground/40'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition duration-150 shadow-sm ${appTheme === 'dark' ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Receipts toggle */}
              <div 
                className="p-3 flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition"
                onClick={() => handleFieldChange('readReceipts', !settings.readReceipts)}
              >
                <div>
                  <h5 className="font-semibold text-xs text-foreground">Read Receipts</h5>
                  <p className="text-[9px] text-muted-foreground">Broadcast checkout statuses dynamically</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full p-0.5 transition duration-150 ${settings.readReceipts ? 'bg-[#0076FF]' : 'bg-muted-foreground/40'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition duration-150 shadow-sm ${settings.readReceipts ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Security toggle */}
              <div 
                className="p-3 flex justify-between items-center cursor-pointer select-none hover:bg-muted/10 transition"
                onClick={() => handleFieldChange('twoFactor', !settings.twoFactor)}
              >
                <div>
                  <h5 className="font-semibold text-xs text-foreground">Two-Factor Authentication</h5>
                  <p className="text-[9px] text-muted-foreground">Keep sessions keys guarded securely</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full p-0.5 transition duration-150 ${settings.twoFactor ? 'bg-[#0076FF]' : 'bg-muted-foreground/40'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition duration-150 shadow-sm ${settings.twoFactor ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick utility list */}
          <div className="space-y-1 pt-1">
            <div className="p-2.5 rounded-lg border-muted/50 bg-card border hover:bg-muted/10 transition duration-150 flex items-center justify-between text-xs cursor-pointer">
              <span className="font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Privacy Regulations
              </span>
            </div>
            <div className="p-2.5 rounded-lg border-muted/50 bg-card border hover:bg-muted/10 transition duration-150 flex items-center justify-between text-xs cursor-pointer">
              <span className="font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Support Center
              </span>
            </div>
            {onLogout && (
              <div 
                onClick={onLogout}
                className="p-2.5 rounded-lg border-rose-550/20 bg-rose-550/5 hover:bg-rose-500/10 border transition duration-150 flex items-center justify-between text-xs cursor-pointer"
              >
                <span className="font-medium text-rose-500 flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5" /> Log Out Session
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
