import React from "react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Label } from "./label"
import { Textarea } from "./textarea"
import { Badge } from "./badge"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Checkbox } from "./checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"

export function UIExample() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tailwind CSS UI Components</h1>
      
      {/* Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex space-x-2">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content area.</p>
          </CardContent>
        </Card>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Form Elements</h2>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Enter your message" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex space-x-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alerts</h2>
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>This is a default alert message.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Error Alert</AlertTitle>
          <AlertDescription>This is an error alert message.</AlertDescription>
        </Alert>
        <Alert variant="success">
          <AlertTitle>Success Alert</AlertTitle>
          <AlertDescription>This is a success alert message.</AlertDescription>
        </Alert>
      </div>

      {/* Avatar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Avatars</h2>
        <div className="flex space-x-2">
          <Avatar>
            <AvatarImage src="/images/placeholder-avatar.png" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs</h2>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p>This is the content for Tab 1.</p>
          </TabsContent>
          <TabsContent value="tab2">
            <p>This is the content for Tab 2.</p>
          </TabsContent>
          <TabsContent value="tab3">
            <p>This is the content for Tab 3.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Accordion</h2>
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
            <AccordionContent>
              Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Why use Tailwind CSS?</AccordionTrigger>
            <AccordionContent>
              It provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Dialog */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setIsDialogOpen(false)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 