<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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

    // Mark as read
    public function markAsRead($id)
    {
        $inbox = Inbox::findOrFail($id);
        $inbox->read_at = now();
        $inbox->save();

        return response()->json(['message' => 'Marked as read.']);
    }

    // Store a new inbox message
    public function store(Request $request)
    {
        $inbox = Inbox::create($request->only([
            'user_id',
            'sender_email',
            'subject',
            'message',
        ]));

        return response()->json($inbox, 201);
    }
}
