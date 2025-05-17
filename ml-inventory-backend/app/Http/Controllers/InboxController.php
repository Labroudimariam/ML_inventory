<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use Illuminate\Http\Request;

class InboxController extends Controller
{
    // Get inbox for a specific user
    public function index(Request $request)
    {
        return Inbox::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Get a specific inbox message
    public function show($id, Request $request)
    {
        $inbox = Inbox::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$inbox) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        return response()->json($inbox);
    }

    // Delete a specific inbox message
    public function destroy($id, Request $request)
    {
        $inbox = Inbox::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$inbox) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        $inbox->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }

    // Mark a message as read
    public function markAsRead($id, Request $request)
    {
        $inbox = Inbox::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$inbox) {
            return response()->json(['message' => 'Message not found or unauthorized'], 404);
        }

        $inbox->read_at = now();
        $inbox->save();

        return response()->json(['message' => 'Marked as read.']);
    }

    // Toggle important status of a message
    public function toggleImportant($id, Request $request)
    {
        $inbox = Inbox::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$inbox) {
            return response()->json(['message' => 'Message not found or unauthorized'], 404);
        }

        $inbox->is_important = !$inbox->is_important;
        $inbox->save();

        return response()->json([
            'message' => 'Importance status updated',
            'is_important' => $inbox->is_important
        ]);
    }

    // Store a new inbox message
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'sender_email' => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
            'read_at' => 'nullable|date',
            'is_important' => 'boolean',
        ]);

        $inbox = Inbox::create($validated);

        return response()->json($inbox, 201);
    }
}