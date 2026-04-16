import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

const StudentMarksheet = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h1 className="text-2xl font-extrabold text-gray-900">Marksheet</h1>
            <p className="text-sm text-gray-500 mt-2">
              Marksheet module is available and protected by permission checks.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentMarksheet
