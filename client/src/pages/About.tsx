import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Server, Code, Layers, CheckCircle2 } from 'lucide-react';

function About() {
  const techStack = [
    {
      icon: Database,
      name: 'MongoDB',
      description: 'NoSQL database for flexible data storage',
      color: 'text-green-600'
    },
    {
      icon: Server,
      name: 'Express.js',
      description: 'Fast, unopinionated web framework for Node.js',
      color: 'text-gray-600'
    },
    {
      icon: Code,
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      color: 'text-blue-600'
    },
    {
      icon: Layers,
      name: 'Node.js',
      description: 'JavaScript runtime built on Chrome\'s V8 engine',
      color: 'text-green-700'
    }
  ];

  const features = [
    'Full TypeScript support',
    'RESTful API architecture',
    'MongoDB integration with Mongoose',
    'React Router for navigation',
    'Axios for HTTP requests',
    'Environment-based configuration',
    'Error handling and validation',
    'Docker support',
    'shadcn/ui components',
    'Tailwind CSS styling'
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">About MERN Application</h1>
        <p className="text-muted-foreground text-lg">
          A modern, production-ready MERN stack application with best practices.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Tech Stack</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <Card key={tech.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className={`h-10 w-10 mb-2 ${tech.color}`} />
                  <CardTitle>{tech.name}</CardTitle>
                  <CardDescription>{tech.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">Vite</Badge>
          <Badge variant="secondary">Express</Badge>
          <Badge variant="secondary">MongoDB</Badge>
          <Badge variant="secondary">Mongoose</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
          <Badge variant="secondary">shadcn/ui</Badge>
          <Badge variant="secondary">React Router</Badge>
          <Badge variant="secondary">Axios</Badge>
          <Badge variant="secondary">Docker</Badge>
        </div>
      </section>
    </div>
  );
}

export default About;

