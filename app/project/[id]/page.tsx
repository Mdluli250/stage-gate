import { getProject } from '@/app/actions/project'
import { listMessages } from '@/app/actions/message'
import { MessageForm } from '@/components/MessageForm'
import { MessageList } from '@/components/MessageList'
import { CommentForm } from '@/components/CommentForm'
import { CommentList } from '@/components/CommentList'
import { RedFlagForm } from '@/components/RedFlagForm'
import { RedFlagList } from '@/components/RedFlagList'
import { ReviewsList } from '@/components/ReviewsList'
import { DocumentUpload } from '@/components/DocumentUpload'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params
  const projectRes = await getProject(id)
  if (!projectRes.ok) return <div className="p-6">Not found</div>
  const { project } = projectRes
  const messagesRes = await listMessages({ projectId: id, page: 1 })
  const initialMessages = messagesRes.ok ? messagesRes.items : []

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-xl font-semibold">{project.name}</CardHeader>
        <CardContent>
          <p className="text-gray-700">{project.description}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>Messages</CardHeader>
          <CardContent>
            <MessageForm projectId={id} />
            <div className="mt-4">
              <MessageList projectId={id} initial={initialMessages as any} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Stages</CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {project.stages.map((s) => (
                <li key={s.id} className="text-sm">
                  {s.name} {s.completed ? '✅' : ''}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>Comments</CardHeader>
          <CardContent>
            <CommentForm projectId={id} />
            <div className="mt-4">
              <CommentList projectId={id} initial={[]} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Red Flags</CardHeader>
          <CardContent>
            <RedFlagForm projectId={id} />
            <div className="mt-4">
              <RedFlagList projectId={id} initial={project.redFlags as any} />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>Reviews</CardHeader>
          <CardContent>
            <ReviewsList projectId={id} initial={project.reviews as any} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Documents</CardHeader>
          <CardContent>
            <DocumentUpload projectId={id} />
            <ul className="mt-3 space-y-1">
              {project.documents.map((d) => (
                <li key={d.id} className="text-sm">
                  <a className="text-blue-600 underline" href={d.sharepointUrl} target="_blank" rel="noreferrer">{d.name}</a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
