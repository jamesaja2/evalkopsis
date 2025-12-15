import { Users } from 'lucide-react';

interface GroupSelectProps {
  groups: string[];
  onSelect: (groupId: string) => void;
}

export default function GroupSelect({ groups, onSelect }: GroupSelectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Human Enough™
          </h1>
          <p className="text-lg text-slate-600">
            Pilih tim kamu untuk memulai challenge
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => onSelect(group)}
              className="group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-100 hover:border-blue-500"
            >
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-300 group-hover:text-blue-500 transition-colors mb-2">
                  {group}
                </div>
                <div className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                  Tim {group}
                </div>
              </div>
              <div className="absolute inset-0 bg-blue-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          Setiap tim akan menjawab pertanyaan dan menyelesaikan tantangan visual
        </div>
      </div>
    </div>
  );
}
