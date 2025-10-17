<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    /**
     * Display all support tickets
     */
    public function index(Request $request)
    {
        $query = SupportTicket::with('user');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $tickets = $query->latest()->paginate(15);

        $stats = [
            'total' => SupportTicket::count(),
            'open' => SupportTicket::where('status', 'open')->count(),
            'in_progress' => SupportTicket::where('status', 'in_progress')->count(),
            'resolved' => SupportTicket::where('status', 'resolved')->count(),
        ];

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'filters' => $request->only(['status', 'priority', 'category', 'search'])
        ]);
    }

    /**
     * Display a specific ticket
     */
    public function show($id)
    {
        $ticket = SupportTicket::with(['user', 'resolver'])->findOrFail($id);

        return Inertia::render('Admin/Support/Show', [
            'ticket' => $ticket
        ]);
    }

    /**
     * Update ticket status
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed'
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update($validated);

        if ($validated['status'] === 'resolved' || $validated['status'] === 'closed') {
            $ticket->update([
                'resolved_at' => now(),
                'resolved_by' => auth()->id()
            ]);
        }

        return redirect()->back()->with('success', 'Ticket status updated successfully');
    }

    /**
     * Add admin response to ticket
     */
    public function respond(Request $request, $id)
    {
        $validated = $request->validate([
            'response' => 'required|string|min:10'
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'admin_response' => $validated['response'],
            'status' => 'in_progress'
        ]);

        return redirect()->back()->with('success', 'Response added successfully');
    }

    /**
     * Assign ticket priority
     */
    public function updatePriority(Request $request, $id)
    {
        $validated = $request->validate([
            'priority' => 'required|in:low,medium,high,urgent'
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update($validated);

        return redirect()->back()->with('success', 'Priority updated successfully');
    }

    /**
     * Delete a ticket
     */
    public function destroy($id)
    {
        $ticket = SupportTicket::findOrFail($id);
        $ticket->delete();

        return redirect()->route('admin.support.index')->with('success', 'Ticket deleted successfully');
    }
}
