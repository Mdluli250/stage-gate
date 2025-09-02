import { ProjectForm } from '@/components/ProjectForm'

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create a Project</h1>
      <ProjectForm />
    </main>
  )
}
