'use client'

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [dailyTasks, setDailyTasks] = useState<any>([]);

  const handleChange = (event: any) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/get-calendar-of-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      setDailyTasks(data);
    } catch (error) {
      // On error, setting some demo tasks
      setDailyTasks([{ task: 'Demo Task 1' }, { task: 'Demo Task 2' }]);
    }
  };

  const handleDownload = () => {
    let icalData = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//EN\n';
    dailyTasks.forEach((task: any) => {
      icalData += `BEGIN:VEVENT\nSUMMARY:${task.task}\nDTSTART:20230401T120000Z\nDTEND:20230401T130000Z\nEND:VEVENT\n`;
    });
    icalData += 'END:VCALENDAR';

    const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'daily-tasks.ical');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        className="mb-4 p-2"
        placeholder="Enter your input"
      />
      <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white">
        Submit
      </button>
      <button onClick={handleDownload} className="mt-4 p-2 bg-green-500 text-white">
        Download Tasks
      </button>
      <div>
        {dailyTasks.map((task: any, index: any) => (
          <div key={index}>{task.task}</div>
        ))}
      </div>
    </main>
  );
}
