'use client'

import { useState } from 'react'
import axios from 'axios'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',  // Changed to match backend expectation
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage('')

    try {
      const response = await axios.post('/api/send', formData)  // Send updated formData with firstName
      setResponseMessage('Message sent successfully!')
    } catch (error) {
      setResponseMessage('Error sending message. Please try again.')
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
      // Reset form after submission
      setFormData({ firstName: '', email: '', phone: '', message: '' })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>We would love to hear from you!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                name="firstName"  // Update name to "firstName"
                placeholder="Your first name" 
                value={formData.firstName}
                onChange={handleChange}
                required
                aria-label="Your first name"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-label="Your email address"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone"
                type="tel" 
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
                aria-label="Your phone number"
              />
            </div>
            <div className="flex flex-col space-y-1.5 sm:col-span-2">
              <Label htmlFor="message">Tell Us About Yourself</Label>
              <Textarea 
                id="message" 
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                required
                className="min-h-[100px]"
                aria-label="Your message"
              />
            </div>
          </div>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
          {responseMessage && <p className="mt-4 text-center">{responseMessage}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
