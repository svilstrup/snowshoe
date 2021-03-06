import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Dropdown } from '../Dropdown';
import { Label } from '../github/Label';

export class FilterByDropdown extends Component {
  shouldComponentUpdate(nextProps) {
    const currentLabels = this.labels(this.props.pulls);
    const nextLabels = this.labels(nextProps.pulls);

    return currentLabels.length !== nextLabels.length
      || _.difference(nextLabels, currentLabels).length !== 0
      || this.props.filters.labels.length !== nextProps.filters.labels.length
      || _.difference(nextProps.filters.labels, this.props.filters.labels).length !== 0;
  }

  labels(pulls) {
    return _.sortedUniqBy(
      _.sortBy(
        pulls
          .filter((pull) => !!pull.labels)
          .reduce((labels, pull) => labels.concat(pull.labels), []),
        'name'
      ),
      'name'
    );
  }

  render() {
    return (
      <Dropdown title="Filter By" disabled={this.props.disabled}>
        <li role="presentation" className="dropdown-header">
          Labels
        </li>
        <li role="presentation" className="divider"></li>
        {this.labels(this.props.pulls).map((label, index) => (
          <li key={index}>
            <Label
              filterable
              filterByLabels={this.props.filterByLabels}
              disabled={this.props.filters.labels.indexOf(label.name) !== -1}
              {...label}
            />
          </li>
        ))}
      </Dropdown>
    );
  }
}

FilterByDropdown.propTypes = {
  disabled: PropTypes.bool.isRequired,
  filterByLabels: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  pulls: PropTypes.arrayOf(
    PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      })),
    })
  ).isRequired,
};
