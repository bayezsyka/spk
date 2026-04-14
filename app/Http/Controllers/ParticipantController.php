<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\ParticipantScore;
use App\Models\Criterion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $participants = Participant::when($search, function($query, $search) {
                $query->where('full_name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Participants/Index', [
            'participants' => $participants,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('Participants/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'pre_test_score' => 'required|numeric|min:0|max:100',
            'report_score' => 'required|numeric|min:0|max:100',
            'domicile_distance_km' => 'required|numeric|min:0',
            'interview_grade' => 'required|string',
            'work_readiness_grade' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $participant = Participant::create($validated);

        // Sync empty scores for all criteria
        foreach (Criterion::all() as $criterion) {
            ParticipantScore::create([
                'participant_id' => $participant->id,
                'criterion_id' => $criterion->id,
            ]);
        }

        return redirect()->route('participants.index')->with('success', 'Peserta berhasil ditambahkan.');
    }

    public function edit(Participant $participant)
    {
        return Inertia::render('Participants/Edit', [
            'participant' => $participant,
        ]);
    }

    public function update(Request $request, Participant $participant)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'pre_test_score' => 'required|numeric|min:0|max:100',
            'report_score' => 'required|numeric|min:0|max:100',
            'domicile_distance_km' => 'required|numeric|min:0',
            'interview_grade' => 'required|string',
            'work_readiness_grade' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $participant->update($validated);

        return redirect()->route('participants.index')->with('success', 'Peserta berhasil diperbarui.');
    }

    public function destroy(Participant $participant)
    {
        $participant->delete();
        return redirect()->route('participants.index')->with('success', 'Peserta berhasil dihapus.');
    }
}
