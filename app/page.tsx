import EventCard from "@/Components/EventCard"
import ExploreBtn from "@/Components/ExploreBtn"
import { events } from "@/lib/constants"


const Page = () => {
  return (
    <section>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {
            events.map((event) =>
            (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            )
            )
          }
        </ul>

      </div>
    </section>
  )
}
export default Page 