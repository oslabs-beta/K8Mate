import React, { useState, useEffect, useContext } from 'react';

import { DateTime } from "luxon";
import moment from "moment-timezone";

import { Button } from "../../components/template/catalyst/button";
import { Checkbox, CheckboxField } from "../../components/template/catalyst/checkbox";
import { Divider } from "../../components/template/catalyst/divider";
import { Description, Label } from "../../components/template/catalyst/fieldset";
import { Heading, Subheading } from "../../components/template/catalyst/heading";
import { Input } from "../../components/template/catalyst/input";
import { Select } from "../../components/template/catalyst/select";
import { Text } from "../../components/template/catalyst/text";
import { Textarea } from "../../components/template/catalyst/textarea";
import { Switch, SwitchField } from "../../components/template/catalyst/switch";

import { getTimezoneOffset } from "../../hooks/useData";

import { SettingsContext } from '../../contexts/SettingsContext'

export const metadata = {
  title: "Settings",
};

export default function Settings() {

    // const {
    //     timezone, 
    //     localTimezone, 
    //     updateTimezone,
    //     isDarkMode,
    //     toggleTheme,
    // } = useContext(SettingsContext)

    const context = useContext(SettingsContext);
    if (!context) {
      throw new Error('Context not within provider');
    }

    const {
      timezone, 
      // localTimezone, 
      updateTimezone,
      isDarkMode,
      toggleTheme
    } = context

  const timezones = [
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedTimezone = e.target.elements.timezone.value; 
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
