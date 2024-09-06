import React, { useState, useEffect, useContext,FormEvent } from 'react';

import { DateTime } from "luxon";
import moment from "moment-timezone";

import { Button } from "../../components/template/catalyst/button.tsx";
import { Checkbox, CheckboxField } from "../../components/template/catalyst/checkbox.tsx";
import { Divider } from "../../components/template/catalyst/divider.tsx";
import { Description, Label } from "../../components/template/catalyst/fieldset.tsx";
import { Heading, Subheading } from "../../components/template/catalyst/heading.tsx";
import { Input } from "../../components/template/catalyst/input.tsx";
import { Select } from "../../components/template/catalyst/select.tsx";
import { Text } from "../../components/template/catalyst/text.tsx";
import { Textarea } from "../../components/template/catalyst/textarea.tsx";
import { Switch, SwitchField } from "../../components/template/catalyst/switch.tsx";

import { getTimezoneOffset } from "../../hooks/useData.ts";

import { SettingsContext } from '../../contexts/SettingsContext'


// types for context values 

interface SettingsContextType {
  timezone: string;
  updateTimezone: (zone:string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const metadata = {
  title: "Settings",
};

export default function Settings() {

    const context = useContext(SettingsContext) as SettingsContextType;
    if (!context) {
      throw new Error('Context not within provider')
    }

    const {
      timezone, 
      // localTimezone, 
      updateTimezone,
      isDarkMode,
      toggleTheme
    } = context

  const timezones: string[] = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Hong_Kong",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Australia/Sydney",
    "Africa/Johannesburg",
    "Africa/Cairo",
    "Asia/Kolkata",
    "Asia/Dubai",
    "Asia/Jakarta",
    "Asia/Seoul",
    "Asia/Manila",
    "Asia/Karachi",
    "Australia/Brisbane",
    "Australia/Perth",
    "Europe/Moscow",
    "Europe/Rome",
    "Europe/Madrid",
    "Europe/Athens",
    "America/Toronto",
    "America/Mexico_City",
    "America/Vancouver",
    "America/Phoenix",
    "America/Sao_Paulo",
    "America/Buenos_Aires",
    "America/Bogota",
    "Pacific/Auckland",
    "Pacific/Honolulu",
    "Pacific/Fiji",
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const selectedTimezone = (form.elements.namedItem('timezone') as HTMLSelectElement).value;
    console.log('Selected Timezone:', selectedTimezone);
    updateTimezone(selectedTimezone)
  }

  return (
    <form method="post" className="mx-auto max-w-4xl" onSubmit={handleSubmit}>
      <Heading>Settings</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6">
        <SwitchField>
          <Label>Dark Mode</Label>
          <Description>Toggle to turn dark mode on and off</Description>
          <div className="transform-none sm:transform scale-125 origin-top-right inline-block">
            <Switch 
              name="dark_mode" 
              checked={isDarkMode}
              onChange= {toggleTheme}
            />
          </div>
        </SwitchField>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Timezone</Subheading>
          <Text>Set your timezone</Text>
        </div>
        <div>
          <Select
            aria-label="Timezone"
            name="timezone"
            defaultValue={timezone}
          >
            {/* <option key={0} value={localTimezone}>
                {localTimezone} -- Local:{" "}
                {DateTime.now().setZone(localTimezone).toFormat("HH:mm")} --{" "}
                {getTimezoneOffset(localTimezone)}
            </option> */}

            {timezones.map((zone, ind) => (
              <option key={ind+1} value={zone}>
                {zone} -- Local:{" "}
                {DateTime.now().setZone(zone).toFormat("HH:mm")} --{" "}
                {getTimezoneOffset(zone)}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        {/* <Button type="reset" plain >
          Reset
        </Button> */}
        <Button type="submit" color="superPurple">Save changes</Button>
      </div>
    </form>
  );
}
