const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack');
const { Tooltip } = require('powercord/components');
const { clipboard } = require('electron');

module.exports = class LinkChannels extends Plugin {
	startPlugin() {
		this.loadStylesheet('style.css');
		const ChannelItem = getModule(m => m.default && m.default.displayName == 'ChannelItem', false);
		inject('linkbutton', ChannelItem, 'default', (_, props) => {
			const children = props.props.children.props.children[1].props.children[1].props.children;
			const channel = children[1].props.channel;
			if (channel.type === 2) return props;
			children.unshift(
				React.createElement(LinkIcon, {
					onClick: () => {
						clipboard.writeText(`<#${channel.id}>`);
						powercord.api.notices.sendToast('linkchannel', {
							header: 'Copied Success',
							timeout: 5000,
							content: `Copied channel id for #${channel.name}!`,
						});
					},
				})
			);
			return props;
		});
		ChannelItem.default.displayName = 'ChannelItem';
	}

	pluginWillUnload() {
		uninject('linkbutton');
	}
};

class LinkIcon extends React.Component {
	render() {
		const classes = getModule(['iconItem'], false);
		const joinClass = (...classNames) => classNames.filter(Boolean).join(' ');
		return React.createElement(
			Tooltip,
			{
				className: 'iconItem-F7GRxr iconBase-3LOlfs',
				text: 'Channel Id',
				position: 'top',
				color: 'black',
			},
			React.createElement(
				'div',
				{
					className: joinClass('linkChannels'),
				},
				React.createElement('svg', {
					className: classes.actionIcon,
					width: '25',
					height: '25',
					viewBox: '0 0 25 25',
					onClick: this.props.onClick,
					children: React.createElement('path', {
						d:
							'M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z',
						fill: 'currentColor',
					}),
				})
			)
		);
	}
}
