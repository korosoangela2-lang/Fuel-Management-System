"""
Timestamp helper.

datetime.utcnow() is deprecated in Python 3.12 and scheduled for removal.
The columns in this project are naive DateTime, so we take an aware UTC
reading and drop the tzinfo — mixing aware and naive values in the same
column is what causes "can't compare offset-naive and offset-aware
datetimes" at query time.
"""
from datetime import datetime, timezone


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)
