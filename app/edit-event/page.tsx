import CreateEventForm from "./CreateEvent";

const EventCreate = () => {
  return (
    <div className="container flex gap-5 flex-col">
      <h1 className="text-2xl font-bold">Create Event</h1>
      <CreateEventForm />
    </div>
  );
};

export default EventCreate;
