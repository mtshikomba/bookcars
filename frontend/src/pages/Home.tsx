import React, { useState, useEffect } from 'react'
import { FormControl, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DateTimeValidationError } from '@mui/x-date-pickers'
import env from '../config/env.config'
import * as bookcarsTypes from ':bookcars-types'
import { strings as commonStrings } from '../lang/common'
import { strings } from '../lang/home'
import * as UserService from '../services/UserService'
import Layout from '../components/Layout'
import LocationSelectList from '../components/LocationSelectList'
import DateTimePicker from '../components/DateTimePicker'

import SecurePayment from '../assets/img/secure-payment.png'
import '../assets/css/home.css'

const HIDE_COVER_TEXT = true

const Home = () => {
  const navigate = useNavigate()

  const _minDate = new Date()
  _minDate.setDate(_minDate.getDate() + 1)

  const [pickupLocation, setPickupLocation] = useState('')
  const [dropOffLocation, setDropOffLocation] = useState('')
  const [minDate, setMinDate] = useState(_minDate)
  const [maxDate, setMaxDate] = useState<Date>()
  const [from, setFrom] = useState<Date>()
  const [to, setTo] = useState<Date>()
  const [sameLocation, setSameLocation] = useState(true)
  const [fromError, setFromError] = useState(false)
  const [toError, setToError] = useState(false)

  useEffect(() => {
    const _from = new Date()
    _from.setDate(_from.getDate() + 1)
    _from.setHours(10)
    _from.setMinutes(0)
    _from.setSeconds(0)
    _from.setMilliseconds(0)

    const _to = new Date(_from)
    _to.setDate(_to.getDate() + 3)

    const _maxDate = new Date(_to)
    _maxDate.setDate(_maxDate.getDate() - 1)
    setMaxDate(_maxDate)

    const __minDate = new Date(_from)
    __minDate.setDate(__minDate.getDate() + 1)

    setMinDate(__minDate)
    setFrom(_from)
    setTo(_to)
  }, [])

  useEffect(() => {
    if (from) {
      const __minDate = new Date(from)
      __minDate.setDate(from.getDate() + 1)
      setMinDate(__minDate)
    }
  }, [from])

  const handlePickupLocationChange = (values: bookcarsTypes.Option[]) => {
    const _pickupLocation = (values.length > 0 && values[0]._id) || ''
    setPickupLocation(_pickupLocation)

    if (sameLocation) {
      setDropOffLocation(_pickupLocation)
    }
  }

  const handleSameLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameLocation(e.target.checked)

    if (e.target.checked) {
      setDropOffLocation(pickupLocation)
    } else {
      setDropOffLocation('')
    }
  }

  const handleDropOffLocationChange = (values: bookcarsTypes.Option[]) => {
    setDropOffLocation((values.length > 0 && values[0]._id) || '')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!pickupLocation || !dropOffLocation || !from || !to || fromError || toError) {
      return
    }

    navigate('/search', {
      state: {
        pickupLocationId: pickupLocation,
        dropOffLocationId: dropOffLocation,
        from,
        to
      }
    })
  }

  const onLoad = () => { }

  return (
    <Layout onLoad={onLoad} strict={false}>
      <div className="home">
        <div className="home-content">
          <div className="home-logo">
            <span className="home-logo-main" />
            <span className="home-logo-registered" />
          </div>
          <div className="home-search">
            {!HIDE_COVER_TEXT && (<div className="home-cover">{strings.COVER}</div>)}
            <form onSubmit={handleSubmit} className="home-search-form">
              <FormControl className="pickup-location">
                <LocationSelectList
                  label={commonStrings.PICKUP_LOCATION}
                  hidePopupIcon
                  customOpen={env.isMobile()}
                  init={!env.isMobile()}
                  required
                  variant="outlined"
                  onChange={handlePickupLocationChange}
                />
              </FormControl>
              <FormControl className="from">
                <DateTimePicker
                  label={commonStrings.FROM}
                  value={from}
                  minDate={_minDate}
                  maxDate={maxDate}
                  variant="outlined"
                  required
                  onChange={(date) => {
                    if (date) {
                      const __minDate = new Date(date)
                      __minDate.setDate(date.getDate() + 1)
                      setFrom(date)
                      setMinDate(__minDate)
                      setFromError(false)
                    } else {
                      setFrom(undefined)
                      setMinDate(_minDate)
                    }
                  }}
                  onError={(err: DateTimeValidationError) => {
                    if (err) {
                      setFromError(true)
                    } else {
                      setFromError(false)
                    }
                  }}
                  language={UserService.getLanguage()}
                />
              </FormControl>
              <FormControl className="to">
                <DateTimePicker
                  label={commonStrings.TO}
                  value={to}
                  minDate={minDate}
                  variant="outlined"
                  required
                  onChange={(date) => {
                    if (date) {
                      const _maxDate = new Date(date)
                      _maxDate.setDate(_maxDate.getDate() - 1)
                      setTo(date)
                      setMaxDate(_maxDate)
                      setToError(false)
                    } else {
                      setTo(undefined)
                      setMaxDate(undefined)
                    }
                  }}
                  onError={(err: DateTimeValidationError) => {
                    if (err) {
                      setToError(true)
                    } else {
                      setToError(false)
                    }
                  }}
                  language={UserService.getLanguage()}
                />
              </FormControl>
              <Button type="submit" variant="contained" className="btn-search">
                {commonStrings.SEARCH}
              </Button>
              {!sameLocation && (
                <FormControl className="drop-off-location">
                  <LocationSelectList
                    label={commonStrings.DROP_OFF_LOCATION}
                    hidePopupIcon
                    customOpen={env.isMobile()}
                    init={!env.isMobile()}
                    required
                    variant="outlined"
                    onChange={handleDropOffLocationChange}
                  />
                </FormControl>
              )}
              <FormControl className="chk-same-location">
                <input
                  id="chk-same-location"
                  type="checkbox"
                  checked={sameLocation}
                  onChange={handleSameLocationChange}
                />
                <label
                  htmlFor="chk-same-location"
                >
                  {strings.DROP_OFF}
                </label>
              </FormControl>
            </form>
          </div>
        </div>
        <footer>
          <div className="copyright">
            <span className="part1">{strings.COPYRIGHT_PART1}</span>
            <span className="part2">{strings.COPYRIGHT_PART2}</span>
            <span className="part3">{strings.COPYRIGHT_PART3}</span>
          </div>
          <div className="secure-payment">
            <img src={SecurePayment} alt="" />
          </div>
        </footer>
      </div>
    </Layout>
  )
}

export default Home
