import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdsenseBottom from "../components/adsenseBottom.jsx";
import AdsenseTop from "../components/adsenseTop.jsx";
import AppHeader from "../components/appHeader.jsx";
import { CALENDAR_URL } from "../constants.jsx";
import { dataHelper } from "../utils/dataUtils.jsx";

const CalendarScreen = () => {
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const year = new Date().getFullYear();
      const url = `${CALENDAR_URL}/${year}_events.json`;
      const data = await dataHelper(`${year}_events`, url, "CALENDAR");
      setCalendarData(data);
      setLoading(false);
    }
    init();
  }, []);

  const MonthsView = ({ month, monthData,index }) => {
    const [expanded, setExpanded] = useState(false);
    const [events, setEvents] = useState([]);
    useEffect(() => {
      const currentMonthNumber = new Date().getMonth();
      if (currentMonthNumber <= index){
        setExpanded(true)
      }
      let events = {};
      for (let i = 0; i < monthData.days.length; i++) {
        let day = monthData.days[i];
        let dayEvents = day.events;
        if (dayEvents.length > 0) {
          events[`${day.day}-${day.dayname}`] = dayEvents;
        }
      }
      setEvents(events);

    },[index])
    return (
      <div className="months-container">
        <div className="month-header" onClick={() => setExpanded(!expanded)}>
          <div className="month-name">{month}</div>
        </div>
        {expanded ? <div className="events-container">
            <EventsView events={events} />
        </div> : null}
      </div>
    );
  };

  const EventsView = ({ events }) => {
    if (Object.entries(events).length > 0) {
      return (
        <>
          {Object.entries(events).map(([key, value], index) => (
            <EventDay key={index} data={value} title={key} />
          ))}
        </>
      );
     } else {
      return (
        <div className="no-events-container">
          <div className="no-events-text">No events</div>
        </div>
      );
    }
  }

  const EventDay = ({ data, title }) => {
    let heading = title.split("-");
    const [expanded, setExpanded] = useState(true);
    return (
      <>
        <div className="day-header">
          <div className="day-name">
            {heading[0]} - {heading[1]}
          </div>
        </div>
        {expanded ? (
          <div className="events-container">
            {data.map((event, index) => (
              <Event key={index} data={event} />
            ))}
          </div>
        ): null}
      </>
    );
  };

  const Event = ({ data }) => {
    return (
      <div>
        <div className="event-title">
          {data.title}{" "}
          {data.fullDay ? "(Full Day)" : `${data.startTime} - ${data.endTime}`}
        </div>
      </div>
    );
  }
  return (
    <>
      <AppHeader
        title={"Calendar"}
        backAction={() => navigate(-1)}
        settingsAction={() => navigate("/settings")}
      />
      <AdsenseTop />
      {calendarData ? (
        <>
          {calendarData?.months.map((month, index) => {
            return (
              <MonthsView
                month={month}
                monthData={calendarData[`${month}`]}
                key={index}
                index={index}
              />
            );
          })}
        </>
      ) : (
        <>
          <div className="coming-soon-container">
            <div className="coming-soon-text">
              {loading ? (
                  <>
                    <h1>Loading...</h1>
                  </>
              ) : (
                <>
                  <h1>Coming Soon</h1>
                  <p>Our new calendar feature is under construction.</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
      <AdsenseBottom />
    </>
  );
};

export default CalendarScreen;
