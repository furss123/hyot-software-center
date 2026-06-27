import { SoftwareForm } from '@/components/SoftwareForm'

export default function NewSoftwarePage(): React.JSX.Element {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Software</h1>
      <SoftwareForm isNew />
    </div>
  )
}
