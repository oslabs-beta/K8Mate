// import libraries/frameworks
import React, { useState, useEffect, useContext,FormEvent } from 'react';
import { DateTime } from "luxon";
import moment from "moment-timezone";

// import components for layout
import { Button } from "../../components/template/catalyst/button.tsx";
import { Checkbox, CheckboxField } from "../../components/template/catalyst/checkbox.tsx";
import { Divider } from "../../components/template/catalyst/divider.tsx";
import { Description, Label } from "../../components/template/catalyst/fieldset.tsx";
import { Heading, Subheading } from "../../components/template/catalyst/heading.tsx";
import { Input } from "../../components/template/catalyst/input.tsx";
import { Select } from "../../components/template/catalyst/select.tsx";
import { Text, Code } from "../../components/template/catalyst/text.tsx";
import { Textarea } from "../../components/template/catalyst/textarea.tsx";
import { Switch, SwitchField } from "../../components/template/catalyst/switch.tsx";

// import helpers
import { getTimezoneOffset } from "../../hooks/useData.ts";
import { SettingsContext } from '../../contexts/SettingsContext'
import * as settingsService from '../../services/settingsService.js'

// types for context values 
interface SettingsContextType {
  timezone: string;
  updateTimezone: (zone:string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  uri: string;
}

export const metadata = {
  title: "Settings",
};

export default function Settings() {
    const [message, setMessage] = useState<string>('')


    const context = useContext(SettingsContext) as SettingsContextType;
    if (!context) {
      throw new Error('Context not within provider')
    }

    const {
      timezone, 
      updateTimezone,
      isDarkMode,
      toggleTheme,
      uri,
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
    console.log('form submitted')
    e.preventDefault()
    setMessage('Settings saved')


    const form = e.target as HTMLFormElement; // Cast the event target to an HTMLFormElement

    // Create a new FormData object from the form
    const formData = new FormData(form);

    // Convert FormData to a plain object
  const formObject = Object.fromEntries(formData.entries());
    // Fetch inputs from formData using their names
    const selectedTimezone = formData.get('timezone') as string; // Ensure the input name matches the form field
    const uri = formData.get('uri') as string; // Ensure the input name matches the form field
    settingsService.update(formObject)
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

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Database</Subheading>
          <Text>Enter your database link. At this time we only support SQL database links</Text>
        </div>
        <div>
          <Input type="text" name="uri" defaultValue={uri} />
          <Text className="flex flex-wrap pt-2">ex: postgresql://<Code>username</Code>:<Code>password</Code>@<Code>host</Code>/<Code>database</Code></Text>
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        <Text className ="flex justify-center items-center">{message}</Text>
        
        <Button type="submit" color="superPurple">Save changes</Button>
        
        
      </div>
    </form>
  );
}
