import plotly.graph_objects as go
import pandas as pd

# Load the data
data = [
    {"service": "Netlify/Vercel", "type": "Frontend", "components": ["React App", "CDN", "SSL Certificate"]}, 
    {"service": "Render/Heroku", "type": "Backend", "components": ["Flask API", "Load Balancer", "Auto Scaling"]}, 
    {"service": "Cloud SQL", "type": "Database", "components": ["PostgreSQL", "Read Replicas", "Automated Backups"]}, 
    {"service": "Cloud Storage", "type": "Storage", "components": ["File Uploads", "Static Assets", "Invoice PDFs"]}, 
    {"service": "Redis", "type": "Cache", "components": ["Session Storage", "API Caching", "Rate Limiting"]}, 
    {"service": "Email Service", "type": "External", "components": ["SendGrid", "Invoice Delivery", "Notifications"]}, 
    {"service": "Monitoring", "type": "Operations", "components": ["Error Tracking", "Performance Monitoring", "Logging"]}
]

# Define brand colors and positions for different service types
colors = ["#1FB8CD", "#DB4545", "#2E8B57", "#5D878F", "#D2BA4C", "#B4413C", "#964325"]
type_colors = {
    "Frontend": "#1FB8CD",
    "Backend": "#DB4545", 
    "Database": "#2E8B57",
    "Storage": "#5D878F",
    "Cache": "#D2BA4C",
    "External": "#B4413C",
    "Operations": "#964325"
}

# Define positions for services (x, y coordinates)
service_positions = {
    "Netlify/Vercel": (2, 4),
    "Render/Heroku": (2, 3),
    "Cloud SQL": (1, 2),
    "Cloud Storage": (3, 2),
    "Redis": (2, 2),
    "Email Service": (4, 3),
    "Monitoring": (1, 1)
}

fig = go.Figure()

# Add connections (lines between services)
connections = [
    ("Netlify/Vercel", "Render/Heroku"),
    ("Render/Heroku", "Cloud SQL"),
    ("Render/Heroku", "Redis"),
    ("Render/Heroku", "Cloud Storage"),
    ("Render/Heroku", "Email Service"),
    ("Monitoring", "Render/Heroku"),
    ("Monitoring", "Cloud SQL"),
    ("Redis", "Cloud SQL")
]

# Draw connection lines
for conn in connections:
    x0, y0 = service_positions[conn[0]]
    x1, y1 = service_positions[conn[1]]
    fig.add_trace(go.Scatter(
        x=[x0, x1], y=[y0, y1],
        mode='lines',
        line=dict(color='#13343B', width=2),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add service nodes
for item in data:
    service_name = item["service"].split('/')[0]
    x, y = service_positions[item["service"]]
    
    # Create hover text with components
    hover_text = f"<b>{service_name}</b><br>Type: {item['type']}<br>Components:<br>"
    for comp in item["components"]:
        hover_text += f"• {comp}<br>"
    
    fig.add_trace(go.Scatter(
        x=[x], y=[y],
        mode='markers+text',
        marker=dict(
            size=40,
            color=type_colors[item["type"]],
            line=dict(width=3, color='white')
        ),
        text=service_name[:8],  # Limit text length
        textposition="middle center",
        textfont=dict(color='white', size=10),
        hovertemplate=hover_text + '<extra></extra>',
        name=item["type"],
        legendgroup=item["type"],
        showlegend=True if item == data[list(type_colors.keys()).index(item["type"])] else False
    ))

# Update layout
fig.update_layout(
    title="Cloud Deploy Architecture",
    xaxis=dict(
        range=[0.5, 4.5],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    yaxis=dict(
        range=[0.5, 4.5],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    plot_bgcolor='white',
    legend=dict(
        orientation='h', 
        yanchor='bottom', 
        y=1.05, 
        xanchor='center', 
        x=0.5
    )
)

fig.update_traces(cliponaxis=False)

# Save the chart
fig.write_image("cloud_architecture.png")