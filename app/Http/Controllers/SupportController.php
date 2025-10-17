<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SupportTicket;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;

class SupportController extends Controller
{
    /**
     * Display the help center page
     */
    public function help()
    {
        return Inertia::render('Support/HelpCenter');
    }

    /**
     * Display the contact support page
     */
    public function contact()
    {
        $tickets = Auth::user()->supportTickets()
            ->latest()
            ->paginate(10);

        return Inertia::render('Support/ContactSupport', [
            'tickets' => $tickets
        ]);
    }

    /**
     * Store a new support ticket
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|in:account,trading,wallet,technical,security,other',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'message' => 'required|string|min:10',
            'attachments' => 'nullable|array|max:3',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120' // 5MB max
        ]);

        $ticket = Auth::user()->supportTickets()->create([
            'ticket_number' => 'TKT-' . strtoupper(uniqid()),
            'subject' => $validated['subject'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'message' => $validated['message'],
            'status' => 'open',
        ]);

        // Handle file uploads if present
        if ($request->hasFile('attachments')) {
            $attachments = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('support-attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType()
                ];
            }
            $ticket->update(['attachments' => $attachments]);
        }

        // Send notification to all admins
        $this->notifyAdmins($ticket);

        return redirect()->back()->with('success', 'Support ticket created successfully. Ticket #' . $ticket->ticket_number);
    }

    /**
     * Send notification to admins about new support ticket
     */
    protected function notifyAdmins(SupportTicket $ticket)
    {
        $user = $ticket->user;

        // Determine icon and priority text
        $icon = match ($ticket->priority) {
            'urgent' => '🔴',
            'high' => '🟠',
            'medium' => '🟡',
            'low' => '🟢',
            default => '🎫'
        };

        $priorityText = ucfirst($ticket->priority);

        // Send notification to all admins
        NotificationService::sendToAdmins(
            type: 'support_ticket',
            title: "New {$priorityText} Priority Support Ticket",
            message: "{$user->name} created a new support ticket: {$ticket->subject}",
            icon: $icon,
            link: "/admin/support/{$ticket->id}",
            data: [
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'priority' => $ticket->priority,
                'category' => $ticket->category,
                'subject' => $ticket->subject,
            ]
        );
    }

    /**
     * Display a specific ticket
     */
    public function show($id)
    {
        $ticket = Auth::user()->supportTickets()->findOrFail($id);

        return Inertia::render('Support/TicketDetail', [
            'ticket' => $ticket
        ]);
    }

    /**
     * Close a ticket
     */
    public function close($id)
    {
        $ticket = Auth::user()->supportTickets()->findOrFail($id);
        $ticket->update(['status' => 'closed']);

        return redirect()->back()->with('success', 'Ticket closed successfully');
    }
}
